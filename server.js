const express = require('express');
const cors = require('cors');
const path = require('path');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.static(path.join(__dirname)));

// Rota para servir o index.html
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'index.html'));
});

// Rota para configuração dos modelos
app.get('/api/config', (req, res) => {
    const providers = [];
    
    // Verificar quais APIs estão configuradas
    if (process.env.OPENAI_API_KEY) {
        providers.push({
            id: 'openai',
            name: 'OpenAI',
            status: 'ready',
            enabled: true
        });
    }
    
    if (process.env.ANTHROPIC_API_KEY) {
        providers.push({
            id: 'anthropic',
            name: 'Anthropic',
            status: 'ready',
            enabled: true
        });
    }
    
    if (process.env.GOOGLE_API_KEY) {
        providers.push({
            id: 'google',
            name: 'Google',
            status: 'ready',
            enabled: true
        });
    }
    
    if (process.env.PERPLEXITY_API_KEY) {
        providers.push({
            id: 'perplexity',
            name: 'Perplexity',
            status: 'ready',
            enabled: true
        });
    }
    
    if (process.env.DEEPSEEK_API_KEY) {
        providers.push({
            id: 'deepseek',
            name: 'DeepSeek',
            status: 'ready',
            enabled: true
        });
    }

    const modelGroups = [
        {
            id: 'openai-chat',
            label: 'OpenAI - Conversação',
            models: [
                {
                    id: 'openai-gpt-4o',
                    name: 'GPT-4o',
                    summary: 'mais recente',
                    description: 'Modelo multimodal com equilíbrio entre qualidade e latência.',
                    provider: 'openai'
                },
                {
                    id: 'openai-gpt-4o-mini',
                    name: 'GPT-4o Mini',
                    summary: 'leve',
                    description: 'Ideal para protótipos rápidos com excelente custo.',
                    provider: 'openai'
                },
                {
                    id: 'openai-gpt-3.5-turbo',
                    name: 'GPT-3.5 Turbo',
                    summary: 'econômico',
                    description: 'Boa opção para tarefas do dia a dia e automações.',
                    provider: 'openai'
                }
            ]
        },
        {
            id: 'anthropic-claude',
            label: 'Anthropic - Claude',
            models: [
                {
                    id: 'anthropic-claude-3-5-sonnet',
                    name: 'Claude 3.5 Sonnet',
                    summary: 'equilíbrio',
                    description: 'Raciocínio avançado com custo controlado.',
                    provider: 'anthropic'
                },
                {
                    id: 'anthropic-claude-3-haiku',
                    name: 'Claude 3 Haiku',
                    summary: 'veloz',
                    description: 'Latência reduzida e respostas concisas.',
                    provider: 'anthropic'
                }
            ]
        },
        {
            id: 'google-gemini',
            label: 'Google - Gemini',
            models: [
                {
                    id: 'google-gemini-1.5-pro',
                    name: 'Gemini 1.5 Pro',
                    summary: 'multimodal',
                    description: 'Integra texto, imagem e código com contexto ampliado.',
                    provider: 'google'
                },
                {
                    id: 'google-gemini-1.5-flash',
                    name: 'Gemini 1.5 Flash',
                    summary: 'alto volume',
                    description: 'Respostas rápidas para fluxos com muito tráfego.',
                    provider: 'google'
                }
            ]
        }
    ];

    res.json({
        providers,
        modelGroups,
        defaults: {
            model: 'openai-gpt-4o',
            temperature: 0.7,
            maxTokens: 2000
        }
    });
});

// Rota para chat (placeholder - implementar integração com APIs)
app.post('/api/chat', async (req, res) => {
    try {
        const { model, messages, temperature, maxTokens } = req.body;
        
        // Aqui você implementaria a integração com as APIs reais
        // Por enquanto, retorna uma resposta de exemplo
        
        res.json({
            content: 'Esta é uma resposta de exemplo. Implemente a integração com as APIs de IA aqui.',
            type: 'text'
        });
    } catch (error) {
        console.error('Erro no chat:', error);
        res.status(500).json({
            error: 'Erro interno do servidor'
        });
    }
});

// Iniciar servidor
app.listen(PORT, () => {
    console.log(`🚀 Multi-AI Hub rodando em http://localhost:${PORT}`);
    console.log(`📁 Servindo arquivos de: ${__dirname}`);
    
    // Verificar variáveis de ambiente
    const configuredAPIs = [];
    if (process.env.OPENAI_API_KEY) configuredAPIs.push('OpenAI');
    if (process.env.ANTHROPIC_API_KEY) configuredAPIs.push('Anthropic');
    if (process.env.GOOGLE_API_KEY) configuredAPIs.push('Google');
    if (process.env.PERPLEXITY_API_KEY) configuredAPIs.push('Perplexity');
    if (process.env.DEEPSEEK_API_KEY) configuredAPIs.push('DeepSeek');
    
    if (configuredAPIs.length > 0) {
        console.log(`🔑 APIs configuradas: ${configuredAPIs.join(', ')}`);
    } else {
        console.log('⚠️  Nenhuma API configurada. Adicione suas chaves no arquivo .env');
    }
});