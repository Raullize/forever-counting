# ForeverCounting

Uma aplicação romântica para contar o tempo que estamos juntos.

## Sobre o Projeto

ForeverCounting é uma homenagem romântica que exibe um contador mostrando há quanto tempo um casal está junto. A aplicação pode ser personalizada com uma data específica, apresenta um carrossel de imagens, player de música do Spotify personalizado e animações adoráveis.

## Funcionalidades

- **Autenticação de Usuário**: Sistema de login simples com contas predefinidas e personalizáveis.
- **Contador ao Vivo**: Exibe o tempo decorrido desde uma data especial em anos, dias, horas, minutos e segundos.
- **Carrossel de Imagens**: Exibe fotos do casal automaticamente.
- **Player de Música**: Integração com Spotify para reproduzir uma playlist personalizada.
- **Design Romântico**: Interface com tons de rosa e animações de corações flutuantes.
- **Easter Egg**: Confetes aparecem ao clicar X vezes no coração na tela de login (número ajustável).
- **Loading Personalizado**: Animações únicas durante login e logout.

## Configuração

A aplicação é totalmente personalizável. É possível definir:
- A data de início do relacionamento
- As credenciais de acesso via arquivo users.json
- As fotos do carrossel
- A playlist do Spotify
- O número de cliques para ativar o easter egg

## Tecnologias Utilizadas

- Next.js 15
- React 19
- CSS Modules
- Spotify Web Embed API

## Como Executar

1. Clone o repositório
2. Instale as dependências com `npm install`
3. Configure suas informações pessoais
4. Execute o projeto com `npm run dev` (com suporte a Turbopack)
5. Acesse http://localhost:3000

## Imagens

Para personalizar o carrossel, adicione suas próprias fotos na pasta `/public/images/` ou adapte o código para usar URLs externas.

## Playlist do Spotify

A aplicação pode ser configurada para reproduzir qualquer playlist do Spotify.
Para personalizar, substitua o ID da playlist no código por sua própria playlist.

## Autor

Desenvolvido com ❤️ por [Raul Lize Teixeira](https://github.com/Raullize)

## Licença

Proprietária - Todos os direitos reservados
