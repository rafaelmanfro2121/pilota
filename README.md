# Pilota — aluguel de motos sem complicação

Landing page da **Pilota**, plataforma que intermedeia o aluguel de motos (110cc a 500cc+) entre quem precisa de moto e locadoras parceiras.

**Site:** https://rafaelmanfro2121.github.io/pilota/

## O que tem
- Visual escuro e editorial (Inter Tight, Inter, JetBrains Mono), fotos reais e rolagem suave
- Motos por categoria com modelos reais de exemplo: Honda Biz 125, Honda PCX 160, Honda CB Twister 250 e Yamaha MT-07 ("ou similar")
- Abertura com revelação do título e da foto, fotos que abrem como cortina, parallax nas fotos de fundo
- Simulador de preço por moto e plano (semanal, mensal, anual)
- Benefícios, requisitos, formulário de contato com validação e perguntas frequentes
- Botão fixo "Quero alugar" no celular
- Respeita "reduzir movimento" do sistema e funciona sem as animações

## Estrutura
```
index.html         página
styles.css         visual (tema escuro, laranja #FF5F1F)
main.js            simulador, formulário e animações (GSAP + ScrollTrigger + Lenis)
assets/            logo, favicon, ícones e imagem de compartilhamento (og.png)
assets/img/        fotos (Pexels, uso comercial livre) em WebP
```

## Ajustes rápidos
- **Preços:** objeto `PRICES` no topo de `main.js` (diária no plano semanal; mensal -10%, anual -20%).
- **WhatsApp:** coloque o número em `WHATSAPP` no topo de `main.js` (ex.: `'5511900000000'`) e o formulário passa a abrir a conversa já preenchida.

## Rodar no computador
```bash
python -m http.server 4200
```
e abra http://localhost:4200.
