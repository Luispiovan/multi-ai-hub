# Multi-AI Hub

Uma interface web moderna e elegante que permite conversar com múltiplas APIs de IA em uma única plataforma unificada.

## ✨ Funcionalidades

- **🤖 Múltiplas APIs de IA**: Suporte para OpenAI, Anthropic, Google, Perplexity, DeepSeek e mais
- **🎨 Interface Moderna**: Design clean e minimalista inspirado no ChatGPT
- **🌓 Tema Claro/Escuro**: Alternância automática com preferência salva
- **📚 Modelos Especializados**: Acesso aos modelos mais recentes para diferentes tarefas
- **💬 Histórico Inteligente**: Gerenciamento completo de conversas
- **⚙️ Configurações Avançadas**: Controle de temperatura, tokens e preferências
- **📱 Totalmente Responsivo**: Experiência perfeita em qualquer dispositivo
- **🔒 Privacidade Total**: Dados armazenados localmente

## 🚀 Instalação Rápida

### 1. Preparar o Projeto
```bash
# Clone ou baixe o projeto
git clone <url-do-projeto>
cd multi-ai-hub

# Ou baixe e extraia o ZIP
```

### 2. Configurar APIs
```bash
# Copie o arquivo de exemplo
cp .env.example .env

# Edite o arquivo .env com suas chaves
# Use seu editor preferido para adicionar as chaves de API
```

**Exemplo do arquivo `.env`:**
```env
OPENAI_API_KEY=sk-sua-chave-openai-aqui
ANTHROPIC_API_KEY=sk-ant-sua-chave-anthropic-aqui
GOOGLE_API_KEY=AIza-sua-chave-google-aqui
PERPLEXITY_API_KEY=pplx-sua-chave-perplexity-aqui
DEEPSEEK_API_KEY=sk-sua-chave-deepseek-aqui
```

### 3. Executar Servidor Local
```bash
# Opção 1: Python (mais comum)
python -m http.server 8000

# Opção 2: Node.js
npx http-server -p 8000

# Opção 3: PHP
php -S localhost:8000
```

**Acesse:** http://localhost:8000

## 🔗 Obter Chaves de API

| Provedor | Link | Tipo |
|----------|------|------|
| 🤖 **OpenAI** | [platform.openai.com/api-keys](https://platform.openai.com/api-keys) | Paga |
| 🧠 **Anthropic** | [console.anthropic.com](https://console.anthropic.com/) | Paga |
| 🔍 **Google** | [makersuite.google.com/app/apikey](https://makersuite.google.com/app/apikey) | Gratuita + Paga |
| 🌐 **Perplexity** | [perplexity.ai/settings/api](https://www.perplexity.ai/settings/api) | Paga |
| 🚀 **DeepSeek** | [platform.deepseek.com/api_keys](https://platform.deepseek.com/api_keys) | Paga |

## 🎯 Como Usar

### Primeira Conversa
1. Abra o projeto no navegador
2. Clique em "Nova conversa"
3. Selecione um modelo de IA
4. Digite sua mensagem e pressione Enter

### Recursos Avançados
- **Alternar Tema**: Botão sol/lua na barra lateral
- **Configurações**: Ajuste temperatura e tokens máximos
- **Histórico**: Todas as conversas são salvas automaticamente
- **Modelos**: Escolha o modelo ideal para cada tarefa

## 🌐 Modelos Suportados

### OpenAI
- **GPT-4o**: Modelo mais avançado (2024)
- **GPT-4 Turbo**: Contexto estendido
- **GPT-3.5 Turbo**: Econômico e rápido
- **DALL-E 3**: Geração de imagens

### Anthropic
- **Claude 3.5 Sonnet**: Mais recente e capaz
- **Claude 3 Opus**: Máxima capacidade
- **Claude 3 Haiku**: Ultra rápido

### Google
- **Gemini 1.5 Pro**: Contexto de 1M tokens
- **Gemini Pro**: Modelo principal
- **Gemini Pro Vision**: Análise de imagens

### Especializados
- **DeepSeek Coder**: Programação avançada
- **DeepSeek Math**: Matemática e cálculos
- **Perplexity Sonar**: Pesquisa em tempo real

## 🔧 Estrutura do Projeto

```
multi-ai-hub/
├── index.html          # Interface principal
├── styles.css          # Estilos e temas
├── script.js           # Lógica da aplicação
├── .env                # Chaves de API (criar do .env.example)
├── .env.example        # Template de configuração
├── .gitignore          # Arquivos ignorados pelo Git
├── CORS-SETUP.md       # Guia de configuração CORS
└── README.md           # Este arquivo
```

## 🔒 Segurança e Privacidade

- **Chaves de API**: Armazenadas no arquivo `.env` local
- **Dados Privados**: Conversas salvas apenas no seu navegador
- **Sem Tracking**: Nenhum dado é enviado para terceiros
- **Código Aberto**: Arquitetura transparente e auditável

## ⚠️ Requisitos Importantes

### CORS (Cross-Origin Resource Sharing)
As APIs de IA têm proteções CORS. **Você DEVE executar via servidor HTTP local:**

❌ **Não funciona**: Abrir `index.html` diretamente no navegador
✅ **Funciona**: Executar via `python -m http.server 8000`

### Créditos das APIs
- Certifique-se de ter créditos suficientes nas APIs que deseja usar
- Algumas APIs têm limitações de rate limiting
- Monitore seu uso para evitar custos inesperados

## 🆘 Solução de Problemas

### Problemas Comuns

**"Arquivo .env não encontrado"**
- Crie o arquivo `.env` na raiz do projeto
- Copie do `.env.example` e preencha as chaves

**"Erro de CORS"**
- Use servidor HTTP local, não abra o arquivo diretamente
- Veja `CORS-SETUP.md` para mais detalhes

**"API Key inválida"**
- Verifique se a chave está correta no `.env`
- Confirme se tem créditos na conta da API

**"Modelo não disponível"**
- Alguns modelos podem não estar disponíveis em todas as regiões
- Tente um modelo diferente do mesmo provedor

### Status das APIs
- Verifique o indicador colorido na barra lateral
- 🔴 Vermelho: Nenhuma API configurada
- 🟡 Amarelo: Algumas APIs configuradas  
- 🟢 Verde: Todas as APIs configuradas

## 🎨 Personalização

O projeto foi desenvolvido com arquitetura modular:
- **CSS Variables**: Fácil customização de cores e temas
- **Componentes**: Interface organizada em componentes reutilizáveis
- **Configurações**: Ajustes de comportamento via interface

## 📄 Licença

Este projeto é open source. Sinta-se livre para usar, modificar e distribuir.

---

**🎉 Pronto para conversar com múltiplas IAs em uma interface moderna e intuitiva!**