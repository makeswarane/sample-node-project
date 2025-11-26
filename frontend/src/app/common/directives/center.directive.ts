import { Directive, ElementRef, Renderer2 } from '@angular/core';

@Directive({
  selector: '[appCenter]'
})
export class CenterDirective {
  constructor(
    private elementRef: ElementRef,
    private renderer: Renderer2
  ) {}

  ngOnInit(){
    const ele = this.elementRef.nativeElement.getBoundingClientRect();
    this.renderer.setStyle(this.elementRef.nativeElement, 'margin-top', `${(window.innerHeight - ele.height) / 2}px`)
  } 
}
