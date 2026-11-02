# Pilota — aluguel de motos sem complicação

Landing page da **Pilota**, plataforma que intermedeia o aluguel de motos (110cc a 500cc+) entre quem precisa de moto e locadoras parceiras.

**Site:** https://rafaelmanfro2121.github.io/pilota/

## O que tem
- Abertura animada: a moto entra na tela, rodas girando, estrada em movimento
- "Como funciona" em 3 passos, com uma moto percorrendo a estrada conforme a rolagem (desktop)
- Motos por cilindrada (Urbana, Trabalho, Aventura, Estrada) com cards 3D
- Simulador de preço por moto e plano (semanal, mensal, anual)
- Benefícios, requisitos, formulário de contato com validação e perguntas frequentes
- Botão fixo "Quero alugar" no celular
- Respeita "reduzir movimento" do sistema e funciona sem as animações

## Estrutura
```
index.html         página
styles.css         visual (tema escuro, laranja #FF6A1A, Unbounded + Outfit)
main.js            simulador, formulário e animações (GSAP + ScrollTrigger)
assets/            logo, favicon, ícones e imagem de compartilhamento (og.png)
```

## Ajustes rápidos
- **Preços:** objeto `PRICES` no topo de `main.js` (diária no plano semanal; mensal -10%, anual -20%).
- **WhatsApp:** coloque o número em `WHATSAPP` no topo de `main.js` (ex.: `'5511900000000'`) e o formulário passa a abrir a conversa já preenchida.

## Rodar no computador
```bash
python -m http.server 4200
```
e abra http://localhost:4200.
