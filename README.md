# Luiz Chaves Advocacia — Landing Page

Landing page institucional 100% estática (HTML, CSS e JavaScript puro),
pronta para hospedagem no **GitHub Pages** — sem necessidade de servidor,
banco de dados ou build.

## Estrutura

```
index.html   → conteúdo e seções da página
style.css    → estilos, responsividade e animações
script.js    → interações (menu, scroll, contadores, FAQ, parallax, formulário)
Logo.png     → logotipo / favicon
```

## Seções

1. **Hero** — chamada principal, contadores animados e selos de credibilidade
2. **Sobre** — apresentação do escritório
3. **Áreas de Atuação** — 6 áreas do Direito
4. **Serviços** — modalidades de atendimento (consulta, assessoria mensal, processos)
5. **Diferenciais** — por que escolher o escritório
6. **Atendimento** — passo a passo do processo
7. **Faixa de CTA** — chamada para agendamento
8. **Depoimentos** — carrossel automático
9. **FAQ** — perguntas frequentes em acordeão
10. **Contato** — dados, mapa e formulário
11. **Rodapé** — navegação, contato e redes sociais

## Interatividade (tudo no navegador)

- Menu mobile com backdrop
- Barra de progresso de leitura e botão "voltar ao topo"
- Animações de entrada ao rolar (reveal)
- Contadores numéricos animados
- Carrossel de depoimentos (autoplay, swipe e pausa no hover)
- Acordeão de FAQ (abre um, fecha os outros)
- Parallax suave no fundo do hero seguindo o mouse
- Formulário com validação que **abre o WhatsApp com a mensagem pronta**

## ⚙️ O que personalizar (dados de exemplo)

Procure e substitua no `index.html`:

| Item | Onde aparece |
|------|--------------|
| Telefone `(11) 3050-7000` | seção Contato e rodapé |
| E-mail `contato@luizchaves.adv.br` | seção Contato e rodapé |
| Endereço `Av. das Nações, 1500` | seção Contato e rodapé |
| `OAB/SP 123.456` | seção Sobre |
| Número do WhatsApp `5511970007000` | botão flutuante, faixa CTA, rodapé e `script.js` (`WHATSAPP_NUMBER`) |
| Links de redes sociais (`instagram.com`, `linkedin.com`) | rodapé |
| **Mapa** | troque o endereço na URL do `<iframe>` (seção Contato) |
| Foto profissional | substitua o placeholder em `.sobre__photo` |

> O número do WhatsApp usado pelo formulário fica em **`script.js`**, na
> constante `WHATSAPP_NUMBER`. Mantenha-o igual ao dos demais botões.

### Receber o formulário por e-mail (opcional)

Como o GitHub Pages não tem servidor, o formulário abre o WhatsApp.
Se quiser receber por e-mail, basta criar uma conta gratuita em
[Formspree](https://formspree.io) ou [Web3Forms](https://web3forms.com)
e apontar o `action` do formulário para o endpoint deles — o bloco no
`script.js` indica onde trocar.

## Publicar no GitHub Pages

1. Suba os arquivos para um repositório no GitHub.
2. Em **Settings → Pages**, selecione a branch (`main`) e a pasta `/root`.
3. Em poucos minutos o site estará no ar em `https://<usuario>.github.io/<repositorio>/`.
