import { Directive, ElementRef, HostListener, Input } from '@angular/core';

@Directive({
  selector: '[appImgFallback]',
})
export class ImageFallbackDirective {
  @Input()
  appImgFallback!: string;

  constructor(private eRef: ElementRef) {}

  @HostListener('error')
  loadFallbackOnError() {
    const element: HTMLImageElement = <HTMLImageElement>this.eRef.nativeElement;
    element.src =
      this.appImgFallback ||
      'https://cdn.icon-icons.com/icons2/1378/PNG/512/avatardefault_92824.png';
  }
}
