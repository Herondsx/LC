# Luiz Chaves — Advocacia (Landing Page)

Landing page institucional estática (HTML, CSS e JavaScript puro). Sem dependências de build — roda direto no GitHub Pages.

## Estrutura
```
index.html    → página principal
style.css     → estilos, animações e responsividade
script.js     → interações (menu, scroll, contadores, slider, formulário)
Logo.png      → logomarca do escritório
```

## Como publicar no GitHub Pages
1. Crie um repositório no GitHub e envie todos os arquivos para a raiz.
2. No repositório, vá em **Settings → Pages**.
3. Em **Source**, selecione a branch `main` e a pasta `/ (root)`.
4. Salve. Em alguns minutos o site estará no ar em `https://<seu-usuario>.github.io/<repositorio>/`.

> Os nomes de arquivo diferenciam maiúsculas/minúsculas no GitHub Pages. Mantenha `Logo.png` exatamente assim.

## Personalização rápida (antes de entregar ao cliente)
> Os dados abaixo já estão preenchidos com **valores de exemplo (fictícios)** apenas para dar conteúdo à preview. Substitua pelos dados reais do escritório:
- **Contato:** telefone `(11) 3050-7000`, e-mail `contato@luizchaves.adv.br`, endereço `Av. das Nações, 1500 — Sala 1204` e horário.
- **OAB:** badge `OAB/SP 123.456` no bloco "Sobre".
- **Estatísticas do hero:** atributos `data-target` (anos, casos, satisfação).
- **Foto profissional:** bloco `.sobre__photo` — troque o placeholder por uma `<img>` real.
- **WhatsApp:** link `#whatsappFloat` (e o footer) usam o número de exemplo `5511970007000`. Troque pelo número real no formato `https://wa.me/55DDDNUMERO`.
- **Depoimentos:** textos dentro de `.depoimentos__track`.
- **Formulário:** hoje exibe uma confirmação local. Para receber e-mails de verdade, conecte a um serviço como Formspree (basta apontar o `action` do `<form>`).

## Recursos incluídos
- Design responsivo (desktop, tablet e mobile) com menu lateral animado.
- Animações de entrada por scroll, contadores numéricos e barra de progresso.
- Carrossel de depoimentos com navegação automática e gestos de toque.
- Paleta e identidade derivadas do logo (azul-marinho + dourado).
- Acessibilidade básica e suporte a `prefers-reduced-motion`.
