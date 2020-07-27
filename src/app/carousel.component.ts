import { AfterViewInit, Component, ContentChildren, Directive, ElementRef, Input, OnInit, QueryList, TemplateRef, ViewChild, ViewChildren, HostListener } from '@angular/core';
import { CarouselItemDirective } from './carousel-item.directive';
import { animate, AnimationBuilder, AnimationFactory, AnimationPlayer, style } from '@angular/animations';

@Directive({
  selector: '.carousel-item',
})
export class CarouselItemElement {}

@Component({
  selector: 'carousel',
  exportAs: 'carousel',
  template: `
    <section class="carousel-wrapper" [ngStyle]="carouselWrapperStyle">
      <ul class="carousel-inner" #carousel>
        <li *ngFor="let item of items; let i = index" class="carousel-item">
          <ng-container [ngTemplateOutlet]="item.tpl"></ng-container>
        </li>
      </ul>
      <div class="carousel-pin-container">
        <div *ngFor="let item of items; let i = index">
          <div class="carousel-pin" (click)="slideTo(i)" [ngClass]="{ active: currentSlide === i }"></div>
        </div>
      </div>
    </section>
    <div *ngIf="showControls" style="margin-top: 1em">
      <button (click)="next()" class="btn btn-default">Next</button>
      <button (click)="prev()" class="btn btn-default">Prev</button>
    </div>
  `,
  styles: [
    `
      ul {
        list-style: none;
        margin: 0;
        padding: 0;
      }

      li {
        flex: 0 0 100%;
      }

      .carousel-wrapper {
        overflow: hidden;
        position: relative;
      }

      .carousel-inner {
        display: flex;
        overflow: unset;
        position: unset;
      }

      .carousel-pin-container {
        position: absolute;
        bottom: 15px;
        width: 100%;
        display: flex;
        justify-content: center;
      }

      .carousel-pin {
        width: 20px;
        height: 20px;
        border: 1px solid black;
        border-radius: 50%;
        margin: 0 10px;
        cursor: pointer;
      }

      .carousel-pin.active {
        background-color: black;
      }
    `,
  ],
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

  next1(slideTo) {
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

  next() {
    if (this.currentSlide + 1 === this.items.length) return;
    this.currentSlide = (this.currentSlide + 1) % this.items.length;
    const offset = this.currentSlide * this.itemWidth;
    const myAnimation: AnimationFactory = this.buildAnimation(offset);
    this.player = myAnimation.create(this.carousel.nativeElement);
    this.player.play();
  }

  private buildAnimation(offset) {
    console.log('offset => ', offset);
    return this.builder.build([animate(this.timing, style({ transform: `translateX(-${offset}px)` }))]);
  }

  prev() {
    if (this.currentSlide === 0) return;

    this.currentSlide = (this.currentSlide - 1 + this.items.length) % this.items.length;
    const offset = this.currentSlide * this.itemWidth;

    const myAnimation: AnimationFactory = this.buildAnimation(offset);
    this.player = myAnimation.create(this.carousel.nativeElement);
    this.player.play();
  }

  prev1(slideTo) {
    if (slideTo < 0) return;

    this.currentSlide = slideTo;
    const offset = this.currentSlide * this.itemWidth;

    const myAnimation: AnimationFactory = this.buildAnimation(offset);
    this.player = myAnimation.create(this.carousel.nativeElement);
    this.player.play();
  }

  constructor(private builder: AnimationBuilder) {}

  slideTo($event) {
    if ($event > this.currentSlide) {
      this.next1($event);
    } else if ($event < this.currentSlide) {
      this.prev1($event);
    }
  }

  ngAfterViewInit() {
    // For some reason only here I need to add setTimeout, in my local env it's working without this.
    setTimeout(() => {
      this.itemWidth = this.itemsElements.first.nativeElement.getBoundingClientRect().width;
      console.log('this.itemWidth => ', this.itemWidth);
      // this.carouselWrapperStyle = {
      //   width: `${this.itemWidth}px`
      // }
    });
  }

  @HostListener('window:resize', ['$event'])
  public onResize(event: Event): void {
    // Reset carousel when window is resized
    // in order to avoid major glitches.
    // setTimeout(() => {
    this.itemWidth = this.itemsElements.first.nativeElement.getBoundingClientRect().width;
    console.log('this.itemWidth => ', this.itemWidth);
    // this.carouselWrapperStyle = {
    //   width: `${this.itemWidth}px`
    // }
    // });
  }
}
