const STORAGE_KEYS = {
    CHATS: "multiAI_chats_v2",
    SETTINGS: "multiAI_settings_v2",
    CURRENT_CHAT: "multiAI_current_chat_v2",
    API_KEYS: "multiAI_api_keys_v2"
};

const DEFAULT_SETTINGS = {
    theme: "dark",
    temperature: 0.7,
    maxTokens: 2000
};

const DEFAULT_API_KEYS = {
    openai: "",
    anthropic: "",
    google: "",
    perplexity: "",
    deepseek: ""
};

class MultiAIChat {
    constructor() {
        this.state = {
            chats: this.loadChats(),
            currentChatId: this.loadCurrentChatId(),
            settings: this.loadSettings(),
            apiKeys: this.loadApiKeys(),
            isSending: false
        };

        this.config = {
            modelGroups: [],
            providers: [],
            defaults: {
                model: "gpt-4o",
                temperature: DEFAULT_SETTINGS.temperature,
                maxTokens: DEFAULT_SETTINGS.maxTokens
            }
        };

        this.elements = {};
        this.loadingMessageEl = null;

        this.init();
    }

    init() {
        this.cacheElements();
        this.bindEvents();
        this.applySettingsToUI();
        this.populateModelSelect();
        this.renderChatHistory();
        this.ensureActiveChat();
        this.renderActiveChat();
        this.updateApiStatus();
        this.updateSendButtonState();
        this.autoResizeTextarea();
        this.fetchConfig();
    }

    cacheElements() {
        this.elements.sidebar = document.getElementById("sidebar");
        this.elements.sidebarToggle = document.getElementById("sidebarToggle");
        this.elements.sidebarClose = document.getElementById("sidebarClose");
        this.elements.newChatBtn = document.getElementById("newChatBtn");
        this.elements.chatHistory = document.getElementById("chatHistory");
        this.elements.historyCounter = document.getElementById("historyCounter");
        this.elements.historyEmptyState = document.getElementById("historyEmptyState");
        this.elements.settingsBtn = document.getElementById("settingsBtn");
        this.elements.settingsModal = document.getElementById("settingsModal");
        this.elements.closeModal = document.getElementById("closeModal");
        this.elements.cancelSettings = document.getElementById("cancelSettings");
        this.elements.saveSettings = document.getElementById("saveSettings");
        this.elements.modelSelect = document.getElementById("modelSelect");
        this.elements.modelHelper = document.getElementById("modelHelper");
        this.elements.chatContainer = document.getElementById("chatContainer");
        this.elements.messageInput = document.getElementById("messageInput");
        this.elements.sendBtn = document.getElementById("sendBtn");
        this.elements.themeToggle = document.getElementById("themeToggle");
        this.elements.clearChat = document.getElementById("clearChat");
        this.elements.apiStatus = document.getElementById("apiStatus");
        this.elements.apiStatusDot = document.getElementById("apiStatusDot");
        this.elements.apiStatusLabel = document.getElementById("apiStatusLabel");
        this.elements.apiStatusGrid = document.getElementById("apiStatusGrid");
        this.elements.temperatureSlider = document.getElementById("temperatureSlider");
        this.elements.temperatureValue = document.getElementById("temperatureValue");
        this.elements.maxTokens = document.getElementById("maxTokens");
        this.elements.themeSelect = document.getElementById("themeSelect");
        this.elements.toastStack = document.getElementById("toastStack");
        this.elements.welcome = this.elements.chatContainer?.querySelector(".welcome");
        this.elements.suggestionCards = Array.from(document.querySelectorAll(".suggestion-card"));
        this.elements.clearHistoryBtn = document.getElementById("clearHistoryBtn");
        
        // Campos de API Keys
        this.elements.openaiKey = document.getElementById("openaiKey");
        this.elements.anthropicKey = document.getElementById("anthropicKey");
        this.elements.googleKey = document.getElementById("googleKey");
        this.elements.perplexityKey = document.getElementById("perplexityKey");
        this.elements.deepseekKey = document.getElementById("deepseekKey");

        // Adicionar efeitos visuais aprimorados
        this.addVisualEnhancements();
    }

    addVisualEnhancements() {
        // Adicionar efeito de hover suave nos botões
        document.querySelectorAll('.primary-btn, .ghost-btn, .icon-btn').forEach(btn => {
            btn.addEventListener('mouseenter', () => {
                btn.style.transform = 'translateY(-2px)';
            });
            btn.addEventListener('mouseleave', () => {
                btn.style.transform = 'translateY(0)';
            });
        });

        // Adicionar animação de digitação no textarea
        if (this.elements.messageInput) {
            this.elements.messageInput.addEventListener('focus', () => {
                this.elements.messageInput.parentElement.style.transform = 'scale(1.02)';
            });
            this.elements.messageInput.addEventListener('blur', () => {
                this.elements.messageInput.parentElement.style.transform = 'scale(1)';
            });
        }
    }

    setupMobileScrollEnhancements() {
        const suggestionGrid = document.querySelector('.suggestion-grid');
        if (!suggestionGrid) return;

        // Detectar se é dispositivo móvel
        const isMobile = window.innerWidth <= 640;
        if (!isMobile) return;

        // Adicionar indicadores de scroll
        let scrollIndicator = null;
        
        const updateScrollIndicator = () => {
            if (!scrollIndicator) return;
            
            const { scrollLeft, scrollWidth, clientWidth } = suggestionGrid;
            const scrollPercentage = scrollLeft / (scrollWidth - clientWidth);
            
            if (scrollPercentage >= 0.9) {
                scrollIndicator.style.opacity = '0';
            } else {
                scrollIndicator.style.opacity = '0.7';
            }
        };

        // Criar indicador de scroll se necessário
        if (suggestionGrid.scrollWidth > suggestionGrid.clientWidth) {
            const welcome = document.querySelector('.welcome');
            if (welcome && !welcome.querySelector('.scroll-indicator')) {
                scrollIndicator = document.createElement('div');
                scrollIndicator.className = 'scroll-indicator';
                scrollIndicator.innerHTML = '→';
                scrollIndicator.style.cssText = `
                    position: absolute;
                    bottom: 16px;
                    right: 20px;
                    width: 24px;
                    height: 24px;
                    background: var(--color-accent);
                    border-radius: 50%;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    color: white;
                    font-size: 14px;
                    font-weight: bold;
                    opacity: 0.7;
                    pointer-events: none;
                    z-index: 1;
                    transition: opacity 0.3s ease;
                `;
                welcome.appendChild(scrollIndicator);
            }
        }

        // Listener para scroll
        suggestionGrid.addEventListener('scroll', updateScrollIndicator);

        // Smooth scroll para cards
        this.elements.suggestionCards?.forEach((card, index) => {
            card.addEventListener('focus', () => {
                card.scrollIntoView({
                    behavior: 'smooth',
                    block: 'nearest',
                    inline: 'center'
                });
            });
        });

        // Atualizar indicador no resize
        window.addEventListener('resize', () => {
            setTimeout(updateScrollIndicator, 100);
        });
    }

    bindEvents() {
        const enterHandlers = [
            [this.elements.sidebarToggle, () => this.openSidebar()],
            [this.elements.sidebarClose, () => this.closeSidebar()],
            [this.elements.newChatBtn, () => this.createNewChat()],
            [this.elements.sendBtn, () => this.sendMessage()],
            [this.elements.themeToggle, () => this.toggleTheme()],
            [this.elements.clearChat, () => this.clearCurrentChat()],
            [this.elements.settingsBtn, () => this.openSettings()],
            [this.elements.closeModal, () => this.closeSettings()],
            [this.elements.cancelSettings, () => this.closeSettings()],
            [this.elements.saveSettings, () => this.handleSettingsSave()],
            [this.elements.clearHistoryBtn, () => this.clearAllHistory()]
        ];

        enterHandlers.forEach(([element, handler]) => {
            if (element) {
                element.addEventListener("click", handler);
            }
        });

        this.elements.messageInput?.addEventListener("input", () => {
            this.autoResizeTextarea();
            this.updateSendButtonState();
        });

        this.elements.messageInput?.addEventListener("keydown", (event) => {
            if (event.key === "Enter" && !event.shiftKey) {
                event.preventDefault();
                this.sendMessage();
            }
        });

        this.elements.modelSelect?.addEventListener("change", () => {
            this.updateModelHelper();
            const activeChat = this.getActiveChat();
            if (activeChat) {
                activeChat.model = this.getSelectedModel();
                this.saveChats();
            }
        });

        this.elements.temperatureSlider?.addEventListener("input", (event) => {
            const value = parseFloat(event.target.value);
            this.updateTemperatureLabel(value);
        });

        this.elements.themeSelect?.addEventListener("change", (event) => {
            this.applyTheme(event.target.value);
        });

        this.elements.settingsModal?.addEventListener("click", (event) => {
            if (event.target === this.elements.settingsModal) {
                this.closeSettings();
            }
        });

        document.addEventListener("keydown", (event) => {
            if (event.key === "Escape" && !this.elements.settingsModal?.hasAttribute("hidden")) {
                this.closeSettings();
            }
        });

        this.elements.suggestionCards?.forEach((card) => {
            card.addEventListener("click", () => {
                const prompt = card.dataset.prompt || "";
                if (!prompt) {
                    return;
                }
                this.elements.messageInput.value = prompt;
                this.autoResizeTextarea();
                this.updateSendButtonState();
                this.sendMessage();
            });
        });

        // Melhorar experiência de scroll em dispositivos móveis
        this.setupMobileScrollEnhancements();

        window.matchMedia("(prefers-color-scheme: dark)").addEventListener("change", () => {
            if (this.state.settings.theme === "auto") {
                this.applyTheme("auto");
            }
        });
    }

    loadChats() {
        try {
            const stored = localStorage.getItem(STORAGE_KEYS.CHATS);
            if (stored) {
                const parsed = JSON.parse(stored);
                return Array.isArray(parsed) ? parsed.map(this.normalizeChat) : [];
            }

            const legacy = localStorage.getItem("multiAI_chats");
            if (legacy) {
                const parsedLegacy = JSON.parse(legacy);
                if (Array.isArray(parsedLegacy)) {
                    const migrated = parsedLegacy.map(this.normalizeChat);
                    localStorage.setItem(STORAGE_KEYS.CHATS, JSON.stringify(migrated));
                    localStorage.removeItem("multiAI_chats");
                    return migrated;
                }
            }
        } catch (error) {
            console.warn("Falha ao carregar conversas salvas:", error);
        }
        return [];
    }

    normalizeChat = (chat) => {
        const now = new Date().toISOString();
        return {
            id: chat?.id || this.generateId(),
            title: chat?.title || "Nova conversa",
            model: chat?.model || this.config.defaults.model,
            createdAt: chat?.createdAt || now,
            updatedAt: chat?.updatedAt || now,
            messages: Array.isArray(chat?.messages)
                ? chat.messages.map(this.normalizeMessage)
                : []
        };
    };

    normalizeMessage = (message) => {
        const now = new Date().toISOString();
        return {
            id: message?.id || this.generateId(),
            role: message?.role || "user",
            content: String(message?.content ?? ""),
            createdAt: message?.createdAt || now,
            type: message?.type || "text"
        };
    };

    loadSettings() {
        try {
            const stored = localStorage.getItem(STORAGE_KEYS.SETTINGS);
            if (stored) {
                return { ...DEFAULT_SETTINGS, ...JSON.parse(stored) };
            }

            const legacy = localStorage.getItem("multiAI_settings");
            if (legacy) {
                const parsedLegacy = JSON.parse(legacy);
                const merged = { ...DEFAULT_SETTINGS, ...parsedLegacy };
                localStorage.setItem(STORAGE_KEYS.SETTINGS, JSON.stringify(merged));
                localStorage.removeItem("multiAI_settings");
                return merged;
            }
        } catch (error) {
            console.warn("Falha ao carregar configura&ccedil;&otilde;es:", error);
        }

        return { ...DEFAULT_SETTINGS };
    }

    loadApiKeys() {
        try {
            const stored = localStorage.getItem(STORAGE_KEYS.API_KEYS);
            if (stored) {
                return { ...DEFAULT_API_KEYS, ...JSON.parse(stored) };
            }
        } catch (error) {
            console.warn("Falha ao carregar chaves de API:", error);
        }
        return { ...DEFAULT_API_KEYS };
    }

    saveApiKeys() {
        try {
            localStorage.setItem(STORAGE_KEYS.API_KEYS, JSON.stringify(this.state.apiKeys));
        } catch (error) {
            console.warn("Falha ao salvar chaves de API:", error);
        }
    }

    loadCurrentChatId() {
        try {
            return localStorage.getItem(STORAGE_KEYS.CURRENT_CHAT) || null;
        } catch {
            return null;
        }
    }

    saveCurrentChatId(chatId) {
        try {
            if (chatId) {
                localStorage.setItem(STORAGE_KEYS.CURRENT_CHAT, chatId);
            } else {
                localStorage.removeItem(STORAGE_KEYS.CURRENT_CHAT);
            }
        } catch {
        }
    }

    applySettingsToUI() {
        const { temperature, maxTokens, theme } = this.state.settings;
        if (this.elements.temperatureSlider) {
            this.elements.temperatureSlider.value = temperature;
            this.updateTemperatureLabel(temperature);
        }
        if (this.elements.maxTokens) {
            this.elements.maxTokens.value = maxTokens;
        }
        if (this.elements.themeSelect) {
            this.elements.themeSelect.value = theme;
        }
        this.applyTheme(theme);

        // Aplicar API keys aos campos
        if (this.elements.openaiKey) {
            this.elements.openaiKey.value = this.state.apiKeys.openai || "";
        }
        if (this.elements.anthropicKey) {
            this.elements.anthropicKey.value = this.state.apiKeys.anthropic || "";
        }
        if (this.elements.googleKey) {
            this.elements.googleKey.value = this.state.apiKeys.google || "";
        }
        if (this.elements.perplexityKey) {
            this.elements.perplexityKey.value = this.state.apiKeys.perplexity || "";
        }
        if (this.elements.deepseekKey) {
            this.elements.deepseekKey.value = this.state.apiKeys.deepseek || "";
        }
    }

    ensureActiveChat() {
        if (this.state.chats.length === 0) {
            this.state.currentChatId = null;
            this.saveCurrentChatId(null);
            return;
        }
        const storedId = this.state.currentChatId;
        const hasStored = this.state.chats.some((chat) => chat.id === storedId);
        if (!hasStored) {
            this.state.currentChatId = this.state.chats[0].id;
            this.saveCurrentChatId(this.state.currentChatId);
        }
    }

    fetchConfig() {
        fetch("/api/config")
            .then((response) => {
                if (!response.ok) {
                    throw new Error(`HTTP ${response.status}`);
                }
                return response.json();
            })
            .then((config) => {
                this.config = {
                    ...this.config,
                    ...config
                };
                this.populateModelSelect();
                this.updateApiStatus();
                this.updateModelHelper();
                this.applyDefaultsFromConfig();
            })
            .catch((error) => {
                console.warn("Falha ao carregar configura&ccedil;&otilde;es do servidor:", error);
                this.showToast(
                    "Falha ao sincronizar",
                    "N&atilde;o foi poss&iacute;vel carregar a lista de modelos do servidor. Usando configura&ccedil;&otilde;es padr&atilde;o.",
                    "error"
                );
            });
    }

    applyDefaultsFromConfig() {
        if (!this.config?.defaults) {
            return;
        }

        const { temperature, maxTokens, model } = this.config.defaults;
        const settings = { ...this.state.settings };
        if (typeof temperature === "number") {
            settings.temperature = temperature;
        }
        if (typeof maxTokens === "number") {
            settings.maxTokens = maxTokens;
        }

        this.state.settings = settings;
        this.applySettingsToUI();

        if (model && this.elements.modelSelect) {
            const hasModel = Array.from(this.elements.modelSelect.options).some(
                (option) => option.value === model
            );
            if (hasModel) {
                this.elements.modelSelect.value = model;
                this.updateModelHelper();
            }
        }
    }

    populateModelSelect() {
        if (!this.elements.modelSelect) {
            return;
        }

        const select = this.elements.modelSelect;
        select.innerHTML = "";

        const groups = Array.isArray(this.config.modelGroups) && this.config.modelGroups.length > 0
            ? this.config.modelGroups
            : this.getFallbackModelGroups();

        groups.forEach((group) => {
            const optgroup = document.createElement("optgroup");
            optgroup.label = group.label;
            group.models.forEach((model) => {
                const option = document.createElement("option");
                option.value = model.id;
                option.textContent = `${model.name}${model.summary ? ` (${model.summary})` : ""}`;
                if (model.description) {
                    option.dataset.description = model.description;
                }
                if (model.provider) {
                    option.dataset.provider = model.provider;
                }
                optgroup.appendChild(option);
            });
            select.appendChild(optgroup);
        });

        const preferred = this.state.settings?.lastModel || this.config.defaults.model;
        const hasPreferred = Array.from(select.options).some((option) => option.value === preferred);
        select.value = hasPreferred ? preferred : select.options[0]?.value;
        this.updateModelHelper();
    }

    getFallbackModelGroups() {
        return [
            {
                id: "openai-chat",
                label: "OpenAI - Conversacao",
                models: [
                    {
                        id: "gpt-4o",
                        name: "GPT-4o",
                        summary: "mais recente",
                        description: "Modelo multimodal de ultima geracao com equilibrio entre qualidade e latencia.",
                        provider: "openai"
                    },
                    {
                        id: "gpt-4o-mini",
                        name: "GPT-4o Mini",
                        summary: "leve",
                        description: "Versao compacta e economica do GPT-4o.",
                        provider: "openai"
                    },
                    {
                        id: "gpt-4-turbo",
                        name: "GPT-4 Turbo",
                        summary: "premium",
                        description: "Modelo avancado com contexto estendido.",
                        provider: "openai"
                    },
                    {
                        id: "o1-preview",
                        name: "O1 Preview",
                        summary: "raciocinio",
                        description: "Modelo de raciocinio avancado para problemas complexos.",
                        provider: "openai"
                    },
                    {
                        id: "o1-mini",
                        name: "O1 Mini",
                        summary: "raciocinio leve",
                        description: "Versao compacta do O1 para raciocinio rapido.",
                        provider: "openai"
                    },
                    {
                        id: "dall-e-3",
                        name: "DALL-E 3",
                        summary: "imagens",
                        description: "Geracao de imagens detalhadas a partir de prompts.",
                        provider: "openai"
                    },
                    {
                        id: "dall-e-2",
                        name: "DALL-E 2",
                        summary: "imagens",
                        description: "Alternativa leve para criacao de imagens.",
                        provider: "openai"
                    }
                ]
            },
            {
                id: "anthropic-claude",
                label: "Anthropic - Claude",
                models: [
                    {
                        id: "claude-3-7-sonnet-20250219",
                        name: "Claude 3.7 Sonnet",
                        summary: "mais recente",
                        description: "Modelo de ultima geracao com raciocinio superior e contexto ampliado.",
                        provider: "anthropic"
                    },
                    {
                        id: "claude-3-5-sonnet-20241022",
                        name: "Claude 3.5 Sonnet",
                        summary: "equilibrio",
                        description: "Raciocinio avancado com custo controlado.",
                        provider: "anthropic"
                    },
                    {
                        id: "claude-3-5-haiku-20241022",
                        name: "Claude 3.5 Haiku",
                        summary: "veloz",
                        description: "Latencia reduzida e respostas concisas.",
                        provider: "anthropic"
                    },
                    {
                        id: "claude-3-opus-20240229",
                        name: "Claude 3 Opus",
                        summary: "premium",
                        description: "Maxima qualidade para tarefas complexas.",
                        provider: "anthropic"
                    }
                ]
            },
            {
                id: "google-gemini",
                label: "Google - Gemini",
                models: [
                    {
                        id: "gemini-2.0-flash-exp",
                        name: "Gemini 2.0 Flash Experimental",
                        summary: "experimental",
                        description: "Versao experimental de proxima geracao com multimodalidade avancada.",
                        provider: "google"
                    },
                    {
                        id: "gemini-1.5-pro",
                        name: "Gemini 1.5 Pro",
                        summary: "multimodal",
                        description: "Integra texto, imagem e codigo com contexto ampliado de ate 2M tokens.",
                        provider: "google"
                    },
                    {
                        id: "gemini-1.5-flash",
                        name: "Gemini 1.5 Flash",
                        summary: "alto volume",
                        description: "Respostas rapidas para fluxos com muito trafego.",
                        provider: "google"
                    },
                    {
                        id: "gemini-1.5-flash-8b",
                        name: "Gemini 1.5 Flash-8B",
                        summary: "ultra leve",
                        description: "Versao ultra compacta para alto volume e baixo custo.",
                        provider: "google"
                    }
                ]
            },
            {
                id: "perplexity-sonar",
                label: "Perplexity - Sonar",
                models: [
                    {
                        id: "sonar-pro",
                        name: "Sonar Pro",
                        summary: "pesquisa",
                        description: "Combina RAG com pesquisa atualizada da web.",
                        provider: "perplexity"
                    },
                    {
                        id: "sonar",
                        name: "Sonar",
                        summary: "equilibrio",
                        description: "Boa relacao entre custo e cobertura de fontes.",
                        provider: "perplexity"
                    }
                ]
            },
            {
                id: "deepseek",
                label: "DeepSeek",
                models: [
                    {
                        id: "deepseek-chat",
                        name: "DeepSeek Chat",
                        summary: "analitico",
                        description: "Modelo geral com foco em raciocinio.",
                        provider: "deepseek"
                    },
                    {
                        id: "deepseek-reasoner",
                        name: "DeepSeek Reasoner",
                        summary: "raciocinio profundo",
                        description: "Modelo especializado em raciocinio complexo e analise.",
                        provider: "deepseek"
                    }
                ]
            }
        ];
    }

    updateModelHelper() {
        if (!this.elements.modelSelect || !this.elements.modelHelper) {
            return;
        }
        const selected = this.elements.modelSelect.selectedOptions[0];
        const description = selected?.dataset.description;
        this.elements.modelHelper.textContent = description
            ? description
            : "Escolha o provedor e o modelo para esta conversa.";
    }
    updateApiStatus() {
        if (!this.elements.apiStatusDot || !this.elements.apiStatusLabel) {
            return;
        }

        // Verificar chaves de API do localStorage
        const localProviders = [
            { id: 'openai', name: 'OpenAI', key: this.state.apiKeys.openai },
            { id: 'anthropic', name: 'Anthropic', key: this.state.apiKeys.anthropic },
            { id: 'google', name: 'Google', key: this.state.apiKeys.google },
            { id: 'perplexity', name: 'Perplexity', key: this.state.apiKeys.perplexity },
            { id: 'deepseek', name: 'DeepSeek', key: this.state.apiKeys.deepseek }
        ];

        const configuredProviders = localProviders.filter(p => p.key && p.key.length > 0);

        if (configuredProviders.length === 0) {
            this.elements.apiStatusDot.className = "status-dot status-dot--issue";
            this.elements.apiStatusLabel.textContent = "Configure suas chaves de API";
        } else if (configuredProviders.length === localProviders.length) {
            this.elements.apiStatusDot.className = "status-dot status-dot--ok";
            this.elements.apiStatusLabel.textContent = "Todas as APIs configuradas";
        } else {
            this.elements.apiStatusDot.className = "status-dot";
            this.elements.apiStatusLabel.textContent = `${configuredProviders.length} de ${localProviders.length} APIs configuradas`;
        }

        if (this.elements.apiStatusGrid) {
            this.elements.apiStatusGrid.innerHTML = "";

            localProviders.forEach((provider) => {
                const card = document.createElement("div");
                card.className = "api-card";
                const hasKey = provider.key && provider.key.length > 0;
                const statusIcon = hasKey
                    ? "<span class=\"status-dot status-dot--ok\"></span>"
                    : "<span class=\"status-dot status-dot--issue\"></span>";
                const statusLabel = hasKey ? "Configurada" : "Não configurada";
                card.innerHTML = `
                    <div class="api-card__header">
                        ${statusIcon}
                        <span>${provider.name}</span>
                    </div>
                    <div class="api-card__status">${statusLabel}</div>
                `;
                this.elements.apiStatusGrid.appendChild(card);
            });
        }
    }

    renderChatHistory() {
        if (!this.elements.chatHistory) {
            return;
        }

        this.elements.chatHistory.innerHTML = "";

        this.state.chats
            .sort((a, b) => new Date(b.updatedAt) - new Date(a.updatedAt))
            .forEach((chat) => {
                const item = document.createElement("div");
                item.className = `chat-item${chat.id === this.state.currentChatId ? " active" : ""}`;
                item.dataset.chatId = chat.id;

                const title = this.escapeHtml(chat.title || "Nova conversa");
                const dateLabel = this.formatRelativeDate(chat.updatedAt);

                item.innerHTML = `
                    <div class="chat-item__meta">
                        <span class="chat-item__title">${title}</span>
                        <span class="chat-item__date">${dateLabel}</span>
                    </div>
                    <div class="chat-item__actions">
                        <button class="icon-btn" data-action="delete" title="Excluir conversa">
                            <i class="fas fa-trash"></i>
                        </button>
                    </div>
                `;

                item.addEventListener("click", (event) => {
                    const target = event.target;
                    if (target.closest("[data-action='delete']")) {
                        event.stopPropagation();
                        this.deleteChat(chat.id);
                        return;
                    }
                    this.setActiveChat(chat.id);
                });

                this.elements.chatHistory.appendChild(item);
            });

        this.updateHistoryState();
    }

    updateHistoryState() {
        if (this.elements.historyCounter) {
            this.elements.historyCounter.textContent = String(this.state.chats.length);
        }

        if (this.elements.historyEmptyState) {
            if (this.state.chats.length === 0) {
                this.elements.historyEmptyState.classList.add("show");
            } else {
                this.elements.historyEmptyState.classList.remove("show");
            }
        }
    }

    setActiveChat(chatId) {
        if (!chatId || chatId === this.state.currentChatId) {
            return;
        }
        this.state.currentChatId = chatId;
        this.saveCurrentChatId(chatId);
        this.renderChatHistory();
        this.renderActiveChat();
    }

    renderActiveChat() {
        const chat = this.getActiveChat();
        this.renderChatMessages(chat);
        if (chat?.model && this.elements.modelSelect) {
            const hasModel = Array.from(this.elements.modelSelect.options).some(
                (option) => option.value === chat.model
            );
            if (hasModel) {
                this.elements.modelSelect.value = chat.model;
                this.updateModelHelper();
            }
        }
    }

    renderChatMessages(chat) {
        if (!this.elements.chatContainer) {
            return;
        }

        this.clearMessages();

        if (!chat || chat.messages.length === 0) {
            this.showWelcomeState();
            return;
        }

        this.hideWelcomeState();
        chat.messages.forEach((message) => {
            this.appendMessageToUI(message, { animate: false });
        });

        this.scrollToBottom();
    }

    clearMessages() {
        const container = this.elements.chatContainer;
        if (!container) {
            return;
        }
        const entries = container.querySelectorAll(".chat-entry");
        entries.forEach((entry) => entry.remove());
    }

    showWelcomeState() {
        if (this.elements.welcome) {
            this.elements.welcome.classList.remove("hidden");
        }
    }

    hideWelcomeState() {
        if (this.elements.welcome) {
            this.elements.welcome.classList.add("hidden");
        }
    }

    getActiveChat() {
        return this.state.chats.find((chat) => chat.id === this.state.currentChatId) || null;
    }

    createNewChat() {
        const model = this.getSelectedModel();
        const now = new Date().toISOString();
        const chat = {
            id: this.generateId(),
            title: "Nova conversa",
            model,
            createdAt: now,
            updatedAt: now,
            messages: []
        };

        this.state.chats.unshift(chat);
        this.state.currentChatId = chat.id;
        this.saveCurrentChatId(chat.id);
        this.saveChats();
        this.renderChatHistory();
        this.renderActiveChat();

        this.elements.messageInput?.focus();
    }

    deleteChat(chatId) {
        const chat = this.state.chats.find((item) => item.id === chatId);
        if (!chat) {
            return;
        }

        const confirmed = window.confirm("Tem certeza de que deseja excluir esta conversa?");
        if (!confirmed) {
            return;
        }

        this.state.chats = this.state.chats.filter((item) => item.id !== chatId);

        if (this.state.currentChatId === chatId) {
            this.state.currentChatId = this.state.chats[0]?.id || null;
            this.saveCurrentChatId(this.state.currentChatId);
        }

        this.saveChats();
        this.renderChatHistory();
        this.renderActiveChat();
    }

    clearCurrentChat() {
        const chat = this.getActiveChat();
        if (!chat) {
            return;
        }
        if (chat.messages.length === 0) {
            this.showToast("Nada para limpar", "Esta conversa j&aacute; est&aacute; vazia.");
            return;
        }

        const confirmed = window.confirm("Remover todas as mensagens desta conversa?");
        if (!confirmed) {
            return;
        }

        chat.messages = [];
        chat.updatedAt = new Date().toISOString();
        this.saveChats();
        this.renderActiveChat();
    }

    clearAllHistory() {
        if (this.state.chats.length === 0) {
            this.showToast("Nada para excluir", "O histórico já está vazio.");
            return;
        }

        const confirmed = window.confirm("Tem certeza de que deseja excluir todo o histórico de conversas? Esta ação não pode ser desfeita.");
        if (!confirmed) {
            return;
        }

        this.state.chats = [];
        this.state.currentChatId = null;
        this.saveCurrentChatId(null);
        this.saveChats();
        this.renderChatHistory();
        this.renderActiveChat();
        this.showToast("Histórico limpo", "Todas as conversas foram excluídas com sucesso.");
    }

    updateChatTitle(chat, userContent) {
        if (!chat) {
            return;
        }
        if (chat.title !== "Nova conversa") {
            return;
        }
        const cleaned = userContent.replace(/\s+/g, " ").trim();
        if (!cleaned) {
            return;
        }
        chat.title = cleaned.slice(0, 60);
    }
    sendMessage() {
        if (this.state.isSending) {
            return;
        }
        if (!this.elements.messageInput) {
            return;
        }

        const content = this.elements.messageInput.value.trim();
        if (!content) {
            return;
        }

        let chat = this.getActiveChat();
        if (!chat) {
            this.createNewChat();
            chat = this.getActiveChat();
        }

        const userMessage = this.createMessage("user", content);
        chat.messages.push(userMessage);
        chat.model = this.getSelectedModel();
        chat.updatedAt = userMessage.createdAt;
        this.updateChatTitle(chat, content);
        this.appendMessageToUI(userMessage);
        this.saveChats();
        this.renderChatHistory();

        this.elements.messageInput.value = "";
        this.autoResizeTextarea();
        this.updateSendButtonState();

        this.requestAssistantResponse(chat)
            .catch((error) => {
                const systemMessage = this.createMessage(
                    "system",
                    `Falha ao obter resposta: ${error.message}`
                );
                chat.messages.push(systemMessage);
                chat.updatedAt = systemMessage.createdAt;
                this.appendMessageToUI(systemMessage);
                this.saveChats();
                this.renderChatHistory();
                this.showToast(
                    "Erro na requisi&ccedil;&atilde;o",
                    "Verifique suas chaves de API ou tente novamente em instantes.",
                    "error"
                );
            })
            .finally(() => {
                this.state.isSending = false;
                this.updateSendButtonState();
                this.hideLoadingIndicator();
            });
    }

    async requestAssistantResponse(chat) {
        this.state.isSending = true;
        this.updateSendButtonState();
        this.showLoadingIndicator();

        const payload = {
            model: this.getSelectedModel(),
            messages: chat.messages.map(({ role, content, type }) => ({ role, content, type })),
            temperature: parseFloat(this.state.settings.temperature),
            maxTokens: parseInt(this.state.settings.maxTokens, 10)
        };

        const response = await fetch("/api/chat", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(payload)
        });

        if (!response.ok) {
            const errorText = await response.text();
            let errorMessage = "Erro desconhecido no servidor.";
            try {
                const errorJson = JSON.parse(errorText);
                errorMessage = errorJson.error || errorJson.message || errorMessage;
            } catch {
                errorMessage = `${errorMessage} (HTTP ${response.status})`;
            }
            throw new Error(errorMessage);
        }

        const result = await response.json();
        const assistantMessage = this.createMessage(
            result.type === "image" ? "assistant" : "assistant",
            result.content
        );
        assistantMessage.type = result.type || "text";
        chat.messages.push(assistantMessage);
        chat.updatedAt = assistantMessage.createdAt;
        this.appendMessageToUI(assistantMessage);
        this.saveChats();
        this.renderChatHistory();
    }

    showLoadingIndicator() {
        if (!this.elements.chatContainer) {
            return;
        }
        this.hideWelcomeState();
        this.hideLoadingIndicator();

        const loading = document.createElement("div");
        loading.className = "message message--assistant chat-entry";
        loading.innerHTML = `
            <div class="message__avatar">
                <i class="fas fa-robot"></i>
            </div>
            <div class="message__body">
                <div class="message__meta">
                    <span class="message__role">Assistente</span>
                </div>
                <div class="message__content">
                    <span class="loading-bubble">
                        <span class="loading-dot"></span>
                        <span class="loading-dot"></span>
                        <span class="loading-dot"></span>
                    </span>
                </div>
            </div>
        `;

        this.loadingMessageEl = loading;
        this.elements.chatContainer.appendChild(loading);
        this.scrollToBottom();
    }

    hideLoadingIndicator() {
        if (this.loadingMessageEl && this.loadingMessageEl.parentElement) {
            this.loadingMessageEl.remove();
            this.loadingMessageEl = null;
        }
    }

    appendMessageToUI(message, { animate = true } = {}) {
        if (!this.elements.chatContainer) {
            return;
        }
        this.hideWelcomeState();
        const element = this.buildMessageElement(message, { animate });
        this.elements.chatContainer.appendChild(element);
        this.scrollToBottom();
    }

    buildMessageElement(message, { animate }) {
        const wrapper = document.createElement("div");
        const roleClass = message.role === "user" ? "message--user" : message.role === "system" ? "message--system" : "message--assistant";
        wrapper.className = `message ${roleClass} chat-entry`;
        if (!animate) {
            wrapper.style.animation = "none";
        }

        const avatarIcon = message.role === "user"
            ? "<i class=\"fas fa-user\"></i>"
            : message.role === "system"
                ? "<i class=\"fas fa-info-circle\"></i>"
                : "<i class=\"fas fa-robot\"></i>";

        const timestamp = this.formatTimestamp(message.createdAt);
        const formattedContent = this.formatMessageContent(message.content, message.type);

        wrapper.innerHTML = `
            <div class="message__avatar">${avatarIcon}</div>
            <div class="message__body">
                <div class="message__meta">
                    <span class="message__role">${this.getRoleLabel(message.role)}</span>
                    <span class="message__timestamp">${timestamp}</span>
                </div>
                <div class="message__content">${formattedContent}</div>
            </div>
        `;
        return wrapper;
    }

    getRoleLabel(role) {
        switch (role) {
            case "user":
                return "Voc&ecirc;";
            case "assistant":
                return "Assistente";
            case "system":
                return "Sistema";
            default:
                return role;
        }
    }

    formatMessageContent(content, type = "text") {
        if (type === "image") {
            return `<img src="${content}" alt="Imagem gerada por IA" style="max-width: 100%; border-radius: 12px; margin-top: 12px;">`;
        }

        return this.escapeHtml(content)
            .replace(/```(\w+)?\n([\s\S]*?)```/g, (match, lang, code) => {
                const language = lang ? `<div class="code-lang">${this.escapeHtml(lang)}</div>` : "";
                return `<pre><code>${language}${this.escapeHtml(code).trim()}</code></pre>`;
            })
            .replace(/`([^`]+)`/g, "<code>$1</code>")
            .replace(/\*\*(.*?)\*\*/g, "<strong>$1</strong>")
            .replace(/\*(.*?)\*/g, "<em>$1</em>")
            .replace(/!\[([^\]]*)\]\(([^)]+)\)/g, '<img src="$2" alt="$1" style="max-width:100%; border-radius:12px; margin:12px 0;">')
            .replace(/\[([^\]]+)\]\(([^)]+)\)/g, '<a href="$2" target="_blank" rel="noopener noreferrer">$1</a>')
            .replace(/\n/g, "<br>");
    }
    showToast(title, message, type = "info") {
        if (!this.elements.toastStack) {
            return;
        }
        const toast = document.createElement("div");
        toast.className = `toast${type === "error" ? " toast--error" : ""}`;
        toast.innerHTML = `
            <div class="toast__icon"><i class="fas ${type === "error" ? "fa-exclamation-circle" : "fa-info-circle"}"></i></div>
            <div>
                <strong>${title}</strong>
                <span>${message}</span>
            </div>
        `;
        this.elements.toastStack.appendChild(toast);
        setTimeout(() => {
            toast.classList.add("hidden");
            setTimeout(() => toast.remove(), 300);
        }, 4000);
    }

    openSidebar() {
        this.elements.sidebar?.classList.add("open");
    }

    closeSidebar() {
        this.elements.sidebar?.classList.remove("open");
    }

    openSettings() {
        if (!this.elements.settingsModal) {
            return;
        }
        this.elements.settingsModal.removeAttribute("hidden");
        this.applySettingsToUI();
    }

    closeSettings() {
        if (!this.elements.settingsModal) {
            return;
        }
        this.elements.settingsModal.setAttribute("hidden", "");
    }

    handleSettingsSave() {
        const temperature = parseFloat(this.elements.temperatureSlider?.value ?? DEFAULT_SETTINGS.temperature);
        const maxTokens = parseInt(this.elements.maxTokens?.value ?? DEFAULT_SETTINGS.maxTokens, 10);
        const theme = this.elements.themeSelect?.value ?? this.state.settings.theme;

        this.state.settings = {
            ...this.state.settings,
            temperature: isNaN(temperature) ? DEFAULT_SETTINGS.temperature : temperature,
            maxTokens: isNaN(maxTokens) ? DEFAULT_SETTINGS.maxTokens : maxTokens,
            theme
        };

        // Salvar API keys
        this.state.apiKeys = {
            openai: this.elements.openaiKey?.value.trim() || "",
            anthropic: this.elements.anthropicKey?.value.trim() || "",
            google: this.elements.googleKey?.value.trim() || "",
            perplexity: this.elements.perplexityKey?.value.trim() || "",
            deepseek: this.elements.deepseekKey?.value.trim() || ""
        };

        this.applyTheme(theme);
        this.saveSettings();
        this.saveApiKeys();
        this.updateApiStatus();
        this.closeSettings();
        this.showToast("Prefer&ecirc;ncias salvas", "Configura&ccedil;&otilde;es e chaves de API atualizadas com sucesso.");
    }

    saveSettings() {
        try {
            localStorage.setItem(STORAGE_KEYS.SETTINGS, JSON.stringify(this.state.settings));
        } catch (error) {
            console.warn("Falha ao salvar configura&ccedil;&otilde;es:", error);
        }
    }

    saveChats() {
        try {
            localStorage.setItem(STORAGE_KEYS.CHATS, JSON.stringify(this.state.chats));
        } catch (error) {
            console.warn("Falha ao salvar conversas:", error);
        }
    }

    toggleTheme() {
        const current = this.state.settings.theme;
        const next = current === "dark" ? "light" : "dark";
        this.state.settings.theme = next;
        this.applyTheme(next);
        this.saveSettings();
        if (this.elements.themeSelect) {
            this.elements.themeSelect.value = next;
        }
    }

    applyTheme(themeValue) {
        const resolvedTheme = this.resolveTheme(themeValue);
        document.body.dataset.theme = resolvedTheme;
        if (this.elements.themeToggle) {
            this.elements.themeToggle.innerHTML = resolvedTheme === "dark"
                ? '<i class="fas fa-sun"></i>'
                : '<i class="fas fa-moon"></i>';
        }
    }

    resolveTheme(themeValue) {
        if (themeValue === "auto") {
            const prefersDark = window.matchMedia("(prefers-color-scheme: dark)").matches;
            return prefersDark ? "dark" : "light";
        }
        return themeValue === "light" ? "light" : "dark";
    }

    updateTemperatureLabel(value) {
        if (this.elements.temperatureValue) {
            this.elements.temperatureValue.textContent = Number(value).toFixed(1);
        }
    }

    autoResizeTextarea() {
        const textarea = this.elements.messageInput;
        if (!textarea) {
            return;
        }
        textarea.style.height = "auto";
        textarea.style.height = `${Math.min(textarea.scrollHeight, 220)}px`;
    }

    updateSendButtonState() {
        if (!this.elements.sendBtn || !this.elements.messageInput) {
            return;
        }
        const hasText = this.elements.messageInput.value.trim().length > 0;
        this.elements.sendBtn.disabled = !hasText || this.state.isSending;
    }

    scrollToBottom() {
        if (!this.elements.chatContainer) {
            return;
        }
        requestAnimationFrame(() => {
            this.elements.chatContainer.scrollTop = this.elements.chatContainer.scrollHeight;
        });
    }

    generateId() {
        if (window.crypto?.randomUUID) {
            return window.crypto.randomUUID();
        }
        return `chat-${Date.now()}-${Math.floor(Math.random() * 10000)}`;
    }

    createMessage(role, content) {
        return {
            id: this.generateId(),
            role,
            content,
            createdAt: new Date().toISOString(),
            type: "text"
        };
    }

    getSelectedModel() {
        return this.elements.modelSelect?.value || this.config.defaults.model;
    }

    escapeHtml(value) {
        return String(value)
            .replace(/&/g, "&amp;")
            .replace(/</g, "&lt;")
            .replace(/>/g, "&gt;")
            .replace(/"/g, "&quot;")
            .replace(/'/g, "&#39;");
    }

    formatTimestamp(value) {
        const date = value ? new Date(value) : new Date();
        if (!Number.isFinite(date.getTime())) {
            return "";
        }
        return new Intl.DateTimeFormat("pt-BR", {
            hour: "2-digit",
            minute: "2-digit"
        }).format(date);
    }

    formatRelativeDate(value) {
        const date = value ? new Date(value) : new Date();
        if (!Number.isFinite(date.getTime())) {
            return "";
        }

        const now = new Date();
        const diff = (now - date) / (1000 * 60 * 60 * 24);

        if (diff < 1) {
            return `Hoje - ${this.formatTimestamp(value)}`;
        }
        if (diff < 2) {
            return `Ontem - ${this.formatTimestamp(value)}`;
        }

        return new Intl.DateTimeFormat("pt-BR", {
            day: "2-digit",
            month: "short"
        }).format(date);
    }
}

document.addEventListener("DOMContentLoaded", () => {
    new MultiAIChat();
});



