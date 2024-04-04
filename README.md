# TrAIner 

Projeto de uma aplicação multiplataforma para realizar exercícios físicos com o uso de visão computacional para avaliar a execução do exercício.

* Projeto desenvolvido como pré-requisito da Softex voltado para empreendedorismo com IA.

## Módulos do projeto

* Home Page Component:
     * [Home](https://github.com/Edge-Academy-UFAL/trAIner2/tree/feature-angular-movenet/trainer/src/app/home)
* Exercise Selection Component:
    * [Exercise-Select](https://github.com/Edge-Academy-UFAL/trAIner2/tree/feature-angular-movenet/trainer/src/app/exercise-selection)
* Workout Component:
  * [Workout](https://github.com/Edge-Academy-UFAL/trAIner2/tree/feature-angular-movenet/trainer/src/app/tab2)

## Como executar?

* Após clonar o repositório, faça o seguinte:

Instalar npm packages:
```bash
  npm install
```
Após a instalação, execute o comando para rodar a aplicação em versão WEB:
```bash
  npm start
```
Você pode usar outro comando para iniciar a aplicação
```bash
  npx ionic serve
```
## Como construir a aplicação em formato apk:

* É necessário instalar o android studio em seu dispositivo para poder realizar a construção do apk.

Inicialmente, vamos buildar a aplicação
```bash
  ionic build
```
Após isso, vamos adicionar a plataforma android no projeto
```bash
  npx cap add android
```
Por fim, vamos abrir o android studio para a construção da aplicação
```bash
  npx cap open android
```

* Nessa parte para obter o arquivo apk, é necessário adicionar a linha de comando no código na parte de android no arquivo "AndroidManifest.xml":
```
<uses-permission android:name="android.permission.CAMERA" /> // Permissão de câmera no android
```
Por fim, vá na parte de menu do android studio -> build  -> Build bundle(s)/ APK (s) -> Build APK

## Telas
<div style="display: block;">
    <img src="/readmeImages/home.jpeg" alt="Home" style="height: 500px;"/>
    <img src="/readmeImages/select exercise.jpeg" alt="Select Exercise" style="height: 500px;"/>
    <img src="/readmeImages/start rep.jpeg" alt="Start rep" style="height: 500px;"/>
    <img src="/readmeImages/end rep.jpeg" alt="End rep" style="height: 500px;"/>
</div>
