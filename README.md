[README.md](https://github.com/user-attachments/files/28346742/README.md)
# PurpleUp — PWA Escola

App de trilha semanal de inglês e espanhol, instalável no iPhone e Android.

---

## Como publicar de graça no GitHub Pages

### Passo 1 — Crie uma conta no GitHub
Acesse https://github.com e crie uma conta gratuita.

### Passo 2 — Crie um repositório
1. Clique em **New repository**
2. Nome: `purpleup`
3. Marque **Public**
4. Clique em **Create repository**

### Passo 3 — Suba os arquivos
1. Na página do repositório, clique em **Add file → Upload files**
2. Arraste toda a pasta `purpleup` (ou os arquivos dentro dela)
3. Clique em **Commit changes**

### Passo 4 — Ative o GitHub Pages
1. Vá em **Settings → Pages**
2. Em **Source**, selecione **Deploy from a branch**
3. Branch: `main` / Pasta: `/ (root)`
4. Clique em **Save**
5. Aguarde 1–2 minutos

### Passo 5 — Seu app está no ar!
O link será: `https://SEU_USUARIO.github.io/purpleup`

Envie esse link para os alunos pelo WhatsApp!

---

## Como o aluno instala

### iPhone (Safari):
1. Abrir o link no Safari
2. Tocar no botão de compartilhar (quadrado com seta)
3. Tocar em **"Adicionar à Tela de Início"**
4. Confirmar — o app aparece com ícone na tela!

### Android (Chrome):
1. Abrir o link no Chrome
2. Tocar nos 3 pontinhos (menu)
3. Tocar em **"Adicionar à tela inicial"**
4. Confirmar — o app aparece na tela!

---

## Ícones

Para gerar os ícones do app (192x192 e 512x512), use:
https://www.pwabuilder.com/imageGenerator

Faça upload de uma imagem quadrada com o logo da Purple e baixe o pacote.
Coloque os arquivos `icon-192.png` e `icon-512.png` dentro da pasta `icons/`.

---

## Painel do professor

Na tela de login, clique em **"Professor"** para acessar o painel admin.
O professor pode cadastrar atividades por dia da semana.
As atividades ficam salvas no navegador (localStorage).

> Para um sistema com banco de dados real e múltiplos professores/turmas,
> a próxima etapa seria integrar com Firebase (gratuito para escolas pequenas).

---

## Estrutura de arquivos

```
purpleup/
├── index.html          ← App principal
├── manifest.json       ← Configuração PWA
├── sw.js               ← Service Worker (modo offline)
├── css/
│   └── style.css       ← Estilos
├── js/
│   ├── data.js         ← Lições e exercícios
│   └── app.js          ← Lógica do app
└── icons/
    ├── icon-192.png    ← Ícone do app (gerar via pwabuilder.com)
    └── icon-512.png    ← Ícone do app (gerar via pwabuilder.com)
```

---

Feito com carinho para a Purple School 💜
