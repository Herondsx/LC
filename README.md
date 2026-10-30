# Luiz Chaves — Advocacia Tributária

Site institucional de página única para um escritório de **Direito Tributário**, com visual inspirado na Apple:
tipografia grande, seções claras e escuras alternadas, barra de navegação em vidro fosco e animações guiadas pelo scroll.

Feito em **HTML, CSS e JavaScript puros**, sem frameworks nem etapa de build: roda direto no **GitHub Pages**.

## Destaques

- **Hero animado**: o monograma "lc" do logo, vetorizado em SVG, é desenhado traço a traço dentro de um medalhão com anel de luz.
- **Manifesto**: as palavras acendem uma a uma conforme a rolagem.
- **Áreas de atuação em bento grid**, com holofote dourado que segue o cursor.
- **Cena da Reforma Tributária**: PIS, Cofins, IPI, ICMS e ISS se fundem em CBS, IBS e IS durante o scroll, seguidos da linha do tempo 2026–2033.
- **Método em cards empilhados** (efeito "stack").
- **FAQ** com acordeão animado e **formulário que envia pelo WhatsApp**.
- Responsivo de 320 px a monitores ultrawide, com respeito a `prefers-reduced-motion` e funcionamento sem JavaScript.

## Estrutura

```
index.html            página principal
404.html              página de erro (usada automaticamente pelo GitHub Pages)
.nojekyll             desativa o Jekyll no GitHub Pages
assets/
  css/style.css       design system + todas as seções
  js/main.js          motor de scroll, menu, FAQ e formulário
  img/logo.png        logo original
  img/favicon.svg     logo vetorizado (favicon)
  img/og.jpg          imagem de compartilhamento (WhatsApp, LinkedIn…)
```

## Publicar no GitHub Pages

1. No repositório, abra **Settings → Pages**.
2. Em **Build and deployment**, escolha **Deploy from a branch**.
3. Selecione a branch `main` e a pasta `/ (root)` e salve.
4. Em alguns minutos o site fica disponível em `https://<usuario>.github.io/<repositorio>/`.

Para testar localmente, sirva a pasta com qualquer servidor estático:

```bash
python3 -m http.server 8000
```

## Antes de entregar ao cliente

Os dados abaixo são **fictícios** e precisam ser trocados:

| O quê | Onde |
| --- | --- |
| WhatsApp `5511970007000` | `index.html` (links `wa.me`) e `WHATSAPP_NUMBER` em `assets/js/main.js` |
| Telefone `(11) 97000-7000` | `index.html` (contato, rodapé e JSON-LD) |
| E-mail, endereço e horário | `index.html` (seção Contato, rodapé e JSON-LD) |
| Número da OAB `OAB/SP 123.456` | `index.html` (seção O advogado e rodapé) |
| Instagram / LinkedIn | `index.html` (rodapé) |
| Foto do advogado | `index.html`, seção `#sobre` (há um comentário explicando como trocar o monograma por uma foto) |
| URL do site | `og:url`, `og:image` e JSON-LD no `<head>` do `index.html` (hoje apontam para `herondsx.github.io/LC`) |

> **Publicidade na advocacia:** o conteúdo foi escrito em tom informativo, sem promessa de resultado,
> depoimentos de clientes ou números de "casos ganhos", que costumam ser considerados captação indevida pelo
> Código de Ética e Disciplina da OAB e pelo Provimento nº 205/2021. Mesmo assim, vale o advogado revisar os textos
> antes da publicação, assim como as datas da Reforma Tributária (EC 132/2023 e LC 214/2025).

## Formulário

Como o GitHub Pages não executa código no servidor, o formulário monta a mensagem e abre o **WhatsApp** já preenchido.
Para receber por e-mail, basta trocar o bloco "Formulário → WhatsApp" em `assets/js/main.js` por um serviço como
[Formspree](https://formspree.io) ou [Web3Forms](https://web3forms.com).

## Personalização rápida

As cores, fontes e medidas ficam em variáveis no topo de `assets/css/style.css` (`--navy`, `--gold`, `--font`…).
A paleta foi extraída do próprio logo: navy `#0c2d3e` e dourado `#c89f71`.
