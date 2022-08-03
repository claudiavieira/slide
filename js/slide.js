export default class Slide {
  constructor(slide, wrapper) {
    this.slide = document.querySelector(slide);
    this.wrapper = document.querySelector(wrapper);
    this.dist = {
      finalPosition: 0, // posição final do slide
      startX: 0, // vai ser pra salvar a referencia inicial de onde esta o meu mouse
      movement: 0 // total que se moveu no momento que cliquei
    }
  }

  moveSlide(distX) {
    // Sempre que eu mover o slide eu posso salvar a distancia
    this.dist.movePosition = distX;
    this.slide.style.transform = `translate3d(${distX}px, 0, 0)`;
  }

  updatePosition(clientX) {
    // No mousemove vou fazer o calculo entre a diferença de quando cliquei e a referencia do novo
     // o valor de this.dist.startX vai ser fixo pq quando clico ele só vai ativar uma vez
     // ja o valor de clientX vai sendo atualizado conforme arrastar
    this.dist.movement = (this.dist.startX - clientX) * 1.6; // multiplica por 1.6 para ficar mais rapido o movimento, fica a sua escolha
    console.log(this.dist.movement);
    return this.dist.finalPosition - this.dist.movement; 
  }

  onStart(event) {
    event.preventDefault();
    this.dist.startX = event.clientX;
    console.log(this.dist.startX);
    // console.log(this);
    console.log('mousedown');
    this.wrapper.addEventListener('mousemove', this.onMove); // adiciona o evento ao dar o primeiro clique, conforme eu segurar e ir arrastando o mouse ele vai ativndo o evento
  }

  onMove(event) {
    console.log('moveu');
    const finalPosition = this.updatePosition(event.clientX);

    // sempre que o onMove for ativado e pegar a finalPosition vou mover o moveSlide para a posição final
    this.moveSlide(finalPosition);
  }

  onEnd(event) {
    console.log('acabou');
    this.wrapper.removeEventListener('mousemove', this.onMove);

    // Quando a pessoa tirar o mouse de cima quero guardar esse valor na finalPosition o valor
    this.dist.finalPosition = this.dist.movePosition;
  }

  addSlideEvents() {
    // mousedown ativa o evento quando clico
    this.wrapper.addEventListener('mousedown', this.onStart);

     // mouseup ativa o evento quando desclicar o mouse
    this.wrapper.addEventListener('mouseup', this.onEnd);
  }

  // todo evento dentro de classe precisa ter o bind, pra fazer referencia ao objeto
  bindEvents() {
    this.onStart = this.onStart.bind(this);
    this.onMove = this.onMove.bind(this);
    this.onEnd = this.onEnd.bind(this);
  }

  init() {
    this.bindEvents();
    this.addSlideEvents();
    return this;
  }
}