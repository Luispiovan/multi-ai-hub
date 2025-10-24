# 🚨 Configuração CORS - Importante!

## Por que preciso de um servidor HTTP?

As APIs de IA têm proteções CORS que impedem requisições diretas quando você abre o arquivo HTML diretamente no navegador (`file://`). 

**❌ Não funciona**: Abrir `index.html` diretamente
**✅ Funciona**: Executar via servidor HTTP local

## 🚀 Soluções Rápidas

### Opção 1: Python (Recomendado)
```bash
# Python 3
python -m http.server 8000

# Python 2 (versões antigas)
python -m SimpleHTTPServer 8000
```

### Opção 2: Node.js
```bash
# Instalar servidor global
npm install -g http-server

# Executar
http-server -p 8000
```

### Opção 3: PHP
```bash
php -S localhost:8000
```

### Opção 4: VS Code Live Server
1. Instale a extensão "Live Server"
2. Clique com botão direito no `index.html`
3. Selecione "Open with Live Server"

## 🌐 Acessar o Projeto

Após executar qualquer comando acima, acesse:
**http://localhost:8000**

## 🔍 Como Saber se Está Funcionando

1. **URL correta**: Deve começar com `http://localhost:8000`
2. **Sem erros CORS**: Console do navegador sem erros de CORS
3. **APIs funcionando**: Indicador verde na barra lateral do projeto

## ❓ Ainda com Problemas?

### Erro: "Comando não encontrado"
- **Python**: Instale em [python.org](https://python.org)
- **Node.js**: Instale em [nodejs.org](https://nodejs.org)
- **PHP**: Instale em [php.net](https://php.net)

### Erro: "Porta já em uso"
Tente uma porta diferente:
```bash
python -m http.server 8080
# Acesse: http://localhost:8080
```

### Erro: "API Key inválida"
- Verifique se o arquivo `.env` existe
- Confirme se as chaves estão corretas
- Verifique se tem créditos na conta da API

---

**💡 Dica**: Depois de configurar uma vez, você pode criar um script ou atalho para iniciar o servidor automaticamente!