import { NgModule } from '@angular/core';

import { CarouselComponent } from './carousel.component';
import { CarouselItemDirective } from './carousel-item.directive';
import { CarouselItemElement } from './carousel-item-selector.directive';
import { CommonModule } from '@angular/common';

@NgModule({
  imports: [CommonModule],
  exports: [CarouselComponent, CarouselItemDirective, CarouselItemElement],
  declarations: [CarouselComponent, CarouselItemDirective, CarouselItemElement],
})
export class CarouselModule { }
