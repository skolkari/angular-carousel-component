import { Component, OnInit, AfterViewInit, ContentChildren, QueryList, ViewChildren, ElementRef, ViewChild, Input, HostListener } from '@angular/core';
import { CarouselItemDirective } from './carousel-item.directive';
import { CarouselItemElement } from './carousel-item-selector.directive';
import { AnimationPlayer, AnimationFactory, animate, style, AnimationBuilder } from '@angular/animations';

@Component({
  selector: 'carousel',
	templateUrl: 'carousel.component.html',
	styleUrls: ['./carousel.component.scss']
})
export class CarouselComponent implements AfterViewInit {

	@ContentChildren(CarouselItemDirective) items: QueryList<CarouselItemDirective>;
	
  @ViewChildren(CarouselItemElement, { read: ElementRef })
	private itemsElements: QueryList<ElementRef>;
	
	@ViewChild('carousel') private carousel: ElementRef;
	
  @Input() timing = '250ms ease-in';
	@Input() showControls = true;
	
  private player: AnimationPlayer;
  private itemWidth: number;
  public currentSlide = 0;
	carouselWrapperStyle = {};
	
  constructor(private builder: AnimationBuilder) {}

  next(slideTo) {
    console.log('this.currentSlide => ', this.currentSlide);
    console.log('slideTo => ', slideTo);
    if (slideTo === this.items.length) return;
    this.currentSlide = slideTo;
    const offset = this.currentSlide * this.itemWidth;
    console.log('offset => ', offset);
    const myAnimation: AnimationFactory = this.buildAnimation(offset);
    this.player = myAnimation.create(this.carousel.nativeElement);
    this.player.play();
  }

  private buildAnimation(offset) {
    console.log('offset => ', offset);
    return this.builder.build([animate(this.timing, style({ transform: `translateX(-${offset}px)` }))]);
  }

  prev(slideTo) {
    if (slideTo < 0) return;

    this.currentSlide = slideTo;
    const offset = this.currentSlide * this.itemWidth;

    const myAnimation: AnimationFactory = this.buildAnimation(offset);
    this.player = myAnimation.create(this.carousel.nativeElement);
    this.player.play();
  }


  slideTo($event) {
    if ($event > this.currentSlide) {
      this.next($event);
    } else if ($event < this.currentSlide) {
      this.prev($event);
    }
  }

  ngAfterViewInit() {
    // For some reason only here I need to add setTimeout, in my local env it's working without this.
    setTimeout(() => {
      this.itemWidth = this.itemsElements.first.nativeElement.getBoundingClientRect().width;
    });
  }

  @HostListener('window:resize', ['$event'])
  public onResize(event: Event): void {
    // Reset carousel when window is resized
    // in order to avoid major glitches.
    this.itemWidth = this.itemsElements.first.nativeElement.getBoundingClientRect().width;
  }
}
