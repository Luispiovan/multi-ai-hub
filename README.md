# Multi-AI Hub 🚀

Plataforma web moderna e responsiva para interação unificada com múltiplas APIs de IA (OpenAI, Anthropic, Google, Perplexity, DeepSeek) através de uma interface elegante e intuitiva.

## 📋 Características

- **🧠 Múltiplas APIs de IA**: OpenAI GPT-4o, Claude 3.5, Gemini 1.5, Perplexity, DeepSeek
- **🔑 Gerenciamento de API Keys**: Configure suas chaves diretamente no front-end
- **🎨 Interface Moderna**: Design responsivo com glassmorphism e animações suaves
- **📱 Totalmente Responsivo**: Scroll lateral inteligente em mobile, grid adaptativo
- **🌓 Tema Claro/Escuro**: Alternância automática com preferência salva
- **💬 Histórico Inteligente**: Gerenciamento completo de conversas
- **⚙️ Configurações Avançadas**: Controle de temperatura, tokens e modelos
- **🔒 Privacidade Total**: Chaves de API e conversas armazenadas localmente no navegador

## 🛠️ Tecnologias

- **Frontend**: HTML5, CSS3, JavaScript (Vanilla)
- **Backend**: Node.js, Express
- **Servidor**: Linux (Ubuntu/CentOS/Debian)
- **Dependências**: Express, CORS, dotenv

## 📦 Instalação no Servidor Linux

### 1. Pré-requisitos

```bash
# Atualizar sistema (Ubuntu/Debian)
sudo apt update && sudo apt upgrade -y

# Instalar Node.js e npm
curl -fsSL https://deb.nodesource.com/setup_24.x | sudo -E bash -
sudo apt-get install -y nodejs

# Verificar instalação
node --version
npm --version

# Instalar Git (se não estiver instalado)
sudo apt install git -y
```

### 2. Clonar e Configurar

```bash
# Clonar repositório
git clone https://github.com/Luispiovan/multi-ai-hub.git
cd multi-ai-hub

# Instalar dependências
npm install

# Criar arquivo de configuração
cp .env.example .env
```

### 3. Configurar Servidor (Opcional)

O arquivo `.env` é opcional. As chaves de API podem ser configuradas diretamente no front-end:

```bash
# Criar arquivo de configuração (opcional)
cp .env.example .env
nano .env
```

```env
# Configurações do servidor
PORT=3000
NODE_ENV=production
```

**💡 Nota**: As chaves de API agora podem ser configuradas diretamente na interface web através do menu de Configurações!

### 4. Executar Aplicação

```bash
# Desenvolvimento
npm run dev

# Produção
npm start

# Com PM2 (recomendado para produção)
sudo npm install -g pm2
pm2 start server.js --name "multi-ai-hub"
pm2 startup
pm2 save
```

### 5. Configurar Nginx (Opcional)

```bash
# Instalar Nginx
sudo apt install nginx -y

# Criar configuração
sudo nano /etc/nginx/sites-available/multi-ai-hub
```

```nginx
server {
    listen 80;
    server_name seu-dominio.com;

    location / {
        proxy_pass http://localhost:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        proxy_cache_bypass $http_upgrade;
    }
}
```

```bash
# Ativar site
sudo ln -s /etc/nginx/sites-available/multi-ai-hub /etc/nginx/sites-enabled/
sudo nginx -t
sudo systemctl restart nginx
```

### 6. SSL com Certbot (Opcional)

```bash
# Instalar Certbot
sudo apt install certbot python3-certbot-nginx -y

# Obter certificado SSL
sudo certbot --nginx -d seu-dominio.com

# Renovação automática
sudo crontab -e
# Adicionar: 0 12 * * * /usr/bin/certbot renew --quiet
```

## 🔑 Configurar API Keys no Front-end

### Método Recomendado: Interface Web

1. Acesse a aplicação no navegador
2. Clique no ícone de **Configurações** (⚙️) na barra lateral
3. Na seção **"Chaves de API"**, insira suas chaves:
   - OpenAI API Key
   - Anthropic API Key
   - Google API Key
   - Perplexity API Key
   - DeepSeek API Key
4. Clique em **"Salvar alterações"**

**🔒 Segurança**: Suas chaves são armazenadas localmente no navegador (localStorage) e nunca são enviadas para servidores externos.

### Obter Chaves de API

| Provedor | URL | Tipo |
|----------|-----|------|
| **OpenAI** | [platform.openai.com/api-keys](https://platform.openai.com/api-keys) | Paga |
| **Anthropic** | [console.anthropic.com](https://console.anthropic.com/) | Paga |
| **Google** | [makersuite.google.com/app/apikey](https://makersuite.google.com/app/apikey) | Gratuita + Paga |
| **Perplexity** | [perplexity.ai/settings/api](https://www.perplexity.ai/settings/api) | Paga |
| **DeepSeek** | [platform.deepseek.com/api_keys](https://platform.deepseek.com/api_keys) | Paga |

## 📁 Estrutura do Projeto

```
multi-ai-hub/
├── index.html          # Interface principal
├── css/
│   └── styles.css      # Estilos e design system
├── js/
│   └── script.js       # Lógica da aplicação
├── server.js           # Servidor Node.js
├── package.json        # Dependências e scripts
├── .env.example        # Template de configuração
├── .env                # Chaves de API (criar)
└── README.md           # Este arquivo
```

## 🚀 Comandos Úteis

```bash
# Verificar status da aplicação
pm2 status

# Ver logs
pm2 logs multi-ai-hub

# Reiniciar aplicação
pm2 restart multi-ai-hub

# Parar aplicação
pm2 stop multi-ai-hub

# Verificar uso de recursos
pm2 monit

# Atualizar aplicação
git pull origin main
npm install
pm2 restart multi-ai-hub
```

## 🔧 Configurações Avançadas

### Variáveis de Ambiente

```env
# Servidor
PORT=3000                    # Porta do servidor
NODE_ENV=production          # Ambiente (development/production)

# Segurança
CORS_ORIGIN=*               # Origens permitidas para CORS
MAX_REQUEST_SIZE=10mb       # Tamanho máximo de requisição

# Rate Limiting
RATE_LIMIT_WINDOW=15        # Janela em minutos
RATE_LIMIT_MAX=100          # Máximo de requisições por janela
```

### Firewall (UFW)

```bash
# Configurar firewall
sudo ufw enable
sudo ufw allow ssh
sudo ufw allow 80
sudo ufw allow 443
sudo ufw allow 3000  # Se não usar Nginx
sudo ufw status
```

### Monitoramento

```bash
# Instalar htop para monitoramento
sudo apt install htop -y

# Verificar uso de recursos
htop
df -h
free -h
```

## 🆘 Solução de Problemas

### Problemas Comuns

**Erro de porta em uso:**
```bash
sudo lsof -i :3000
sudo kill -9 PID
```

**Permissões de arquivo:**
```bash
sudo chown -R $USER:$USER /caminho/para/multi-ai-hub
chmod -R 755 /caminho/para/multi-ai-hub
```

**Logs de erro:**
```bash
# Logs do PM2
pm2 logs multi-ai-hub --lines 50

# Logs do sistema
sudo journalctl -u nginx -f
```

**Reiniciar serviços:**
```bash
sudo systemctl restart nginx
pm2 restart multi-ai-hub
```

## 📊 Performance

### Otimizações Implementadas
- **CSS otimizado**: Clamp functions, GPU acceleration
- **JavaScript modular**: Carregamento eficiente
- **Servidor Express**: Middleware otimizado
- **Compressão**: Gzip automático
- **Cache**: Headers de cache apropriados

### Métricas Esperadas
- **Tempo de carregamento**: < 2s
- **First Contentful Paint**: < 1.2s
- **Uso de memória**: ~50MB
- **CPU**: < 5% em idle

## 🔒 Segurança

### Boas Práticas Implementadas
- **Variáveis de ambiente**: Chaves de API protegidas
- **CORS configurado**: Origens controladas
- **Headers de segurança**: Proteção contra ataques
- **Rate limiting**: Proteção contra spam
- **Validação de entrada**: Sanitização de dados

## 📄 Licença

MIT License - Livre para uso pessoal e comercial.

---

**🎉 Multi-AI Hub pronto para produção em servidor Linux!**

*Para suporte: [Criar issue no GitHub](https://github.com/Luispiovan/multi-ai-hub/issues)*