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
                    id: 'gpt-4o',
                    name: 'GPT-4o',
                    summary: 'mais recente',
                    description: 'Modelo multimodal de última geração com equilíbrio entre qualidade e latência.',
                    provider: 'openai'
                },
                {
                    id: 'gpt-4o-mini',
                    name: 'GPT-4o Mini',
                    summary: 'leve',
                    description: 'Versão compacta e econômica do GPT-4o.',
                    provider: 'openai'
                },
                {
                    id: 'gpt-4-turbo',
                    name: 'GPT-4 Turbo',
                    summary: 'premium',
                    description: 'Modelo avançado com contexto estendido.',
                    provider: 'openai'
                },
                {
                    id: 'o1-preview',
                    name: 'O1 Preview',
                    summary: 'raciocínio',
                    description: 'Modelo de raciocínio avançado para problemas complexos.',
                    provider: 'openai'
                },
                {
                    id: 'o1-mini',
                    name: 'O1 Mini',
                    summary: 'raciocínio leve',
                    description: 'Versão compacta do O1 para raciocínio rápido.',
                    provider: 'openai'
                }
            ]
        },
        {
            id: 'anthropic-claude',
            label: 'Anthropic - Claude',
            models: [
                {
                    id: 'claude-3-7-sonnet-20250219',
                    name: 'Claude 3.7 Sonnet',
                    summary: 'mais recente',
                    description: 'Modelo de última geração com raciocínio superior e contexto ampliado.',
                    provider: 'anthropic'
                },
                {
                    id: 'claude-3-5-sonnet-20241022',
                    name: 'Claude 3.5 Sonnet',
                    summary: 'equilíbrio',
                    description: 'Raciocínio avançado com custo controlado.',
                    provider: 'anthropic'
                },
                {
                    id: 'claude-3-5-haiku-20241022',
                    name: 'Claude 3.5 Haiku',
                    summary: 'veloz',
                    description: 'Latência reduzida e respostas concisas.',
                    provider: 'anthropic'
                },
                {
                    id: 'claude-3-opus-20240229',
                    name: 'Claude 3 Opus',
                    summary: 'premium',
                    description: 'Máxima qualidade para tarefas complexas.',
                    provider: 'anthropic'
                }
            ]
        },
        {
            id: 'google-gemini',
            label: 'Google - Gemini',
            models: [
                {
                    id: 'gemini-2.0-flash-exp',
                    name: 'Gemini 2.0 Flash Experimental',
                    summary: 'experimental',
                    description: 'Versão experimental de próxima geração com multimodalidade avançada.',
                    provider: 'google'
                },
                {
                    id: 'gemini-1.5-pro',
                    name: 'Gemini 1.5 Pro',
                    summary: 'multimodal',
                    description: 'Integra texto, imagem e código com contexto ampliado de até 2M tokens.',
                    provider: 'google'
                },
                {
                    id: 'gemini-1.5-flash',
                    name: 'Gemini 1.5 Flash',
                    summary: 'alto volume',
                    description: 'Respostas rápidas para fluxos com muito tráfego.',
                    provider: 'google'
                },
                {
                    id: 'gemini-1.5-flash-8b',
                    name: 'Gemini 1.5 Flash-8B',
                    summary: 'ultra leve',
                    description: 'Versão ultra compacta para alto volume e baixo custo.',
                    provider: 'google'
                }
            ]
        }
    ];

    res.json({
        providers,
        modelGroups,
        defaults: {
            model: 'gpt-4o',
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