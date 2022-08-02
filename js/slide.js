export default class Slide {
  constructor(slide, wrapper) {
    this.slide = document.querySelector(slide);
    this.wrapper = document.querySelector(wrapper);
  }

  onStart(event) {
    event.preventDefault();
    // console.log(this);
    console.log('mousedown');
    this.wrapper.addEventListener('mousemove', this.onMove); // adiciona o evento ao dar o primeiro clique
  }

  onMove(event) {
    console.log('moveu');
  }

  onEnd(event) {
    console.log('acabou');
    this.wrapper.removeEventListener('mousemove', this.onMove);
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