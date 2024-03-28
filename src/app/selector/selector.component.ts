import { animate, style, transition, trigger } from '@angular/animations';
import { AfterViewChecked, Component, ElementRef, HostListener, Input, OnInit, ViewChild, forwardRef } from '@angular/core';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';
import { Day } from './day';

@Component({
  selector: 'app-selector',
  templateUrl: './selector.component.html',
  styleUrls: ['./selector.component.scss'],
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => SelectorComponent),
      multi: true
    }
  ],
  animations: [
    trigger("slideTransition", [
      transition(':enter', [
        style({
          transform: 'translateX(-1000px)'
        }),
        animate("1000ms 100ms")
      ]),
      transition(':leave', [
        animate("1000ms", style({
          transform: 'translateX(1000px)'
        }))
      ])
    ])
  ]
})
export class SelectorComponent implements OnInit, AfterViewChecked, ControlValueAccessor {
  @Input() days: Array<Day> = [];
  @Input() multiple: boolean = false;
  @ViewChild("daysSlider") sliderRef?: ElementRef;

  readonly dayElementwidth: number = 40;
  readonly dayElementsGap: number = 10;

  selectedDays: Array<Day> = [];
  displayedDays: Array<Day> = [];
  currentPage: number = 0;
  mustToBeVisibleElementId: number = -1;

  modelChange: () => void = () => {};
  modelTouch: () => void = () => {};
  isDisabled: boolean = false;

  constructor() {}

  ngOnInit(): void {
    setTimeout(() => {
      this.updateDisplayedDays();
      this.updateMustToBeVisibleElementId();
    }, 0);
  }

  ngAfterViewChecked(): void {
    this.updateSliderEdgeShadows();
  }

  @HostListener('window:resize', [])
  onResize() {
    this.updateDisplayedDays();
  }

  writeValue(days: Array<Day>): void {
    this.selectedDays = days
  }

  registerOnChange(fn: () => void): void {
    this.modelChange = fn;
  }
  
  registerOnTouched(fn: () => void): void {
    this.modelTouch = fn;
  }
  
  setDisabledState?(isDisabled: boolean): void {
    this.isDisabled = isDisabled;
  }

  private updateSliderEdgeShadows(): void {
    if(!this.isExistPrevPage())
      this.sliderRef?.nativeElement.querySelectorAll("header .dayElement")?.forEach((el: HTMLElement) => el.style.left = "0");

    this.sliderRef?.nativeElement.querySelector("header")?.classList.toggle("initialSliderMask", this.isExistPrevPage());
    this.sliderRef?.nativeElement.querySelector("header")?.classList.toggle("finalSliderMask", this.isExistNextPage());
  }

  private calcDaysToDisplay(): number{
    const sliderWidth: number = this.sliderRef?.nativeElement.clientWidth as number;
    return Math.floor((sliderWidth + this.dayElementsGap * 2) / (this.dayElementwidth + this.dayElementsGap));
  }

  private updateDisplayedDays(isCheckPage: boolean = true): void {
    if(isCheckPage)
      this.dynamicPageUpdate();      

    const elementsPerPage: number = this.calcDaysToDisplay();
    const initElementIndex: number = Math.floor(this.currentPage * elementsPerPage);
    this.displayedDays = this.days.slice(initElementIndex, initElementIndex + elementsPerPage);
  }

  private updateMustToBeVisibleElementId() : void {
    this.mustToBeVisibleElementId = this.displayedDays.length > 0 ?
      this.displayedDays[this.displayedDays.length - 1].id : -1;
  }

  private dynamicPageUpdate(): void {
    if(this.displayedDays.length === 0 || this.mustToBeVisibleElementId === -1) return;
    const newElementsPerPage: number = this.calcDaysToDisplay();
    const mustToBeVisibleElementIndex: number = this.days.findIndex(day => day.id === this.mustToBeVisibleElementId);
    this.currentPage = Math.ceil(mustToBeVisibleElementIndex / newElementsPerPage) - 1;
  }

  public handleDayClick(day: Day): void {
    if(this.isDaySelected(day)){
      this.unSelectDay(day);
      return
    }
    this.selectDay(day);
  }

  public isDaySelected(day: Day): boolean {
    return this.selectedDays.some(selectedDay => selectedDay.id === day.id);
  }

  private unSelectDay(day: Day): void {
    const elementIndexToDeselect: number = this.selectedDays
      .findIndex(selectedDay => selectedDay.id === day.id);
    
    if(elementIndexToDeselect < 0) return;
    this.selectedDays.splice(elementIndexToDeselect, 1);
  }

  private selectDay(day: Day): void {
    if(this.multiple)
      this.selectedDays = [];
    this.selectedDays.push(day);
  }

  public goNextPage(): void {
    if(!this.isExistNextPage()) return;
    this.currentPage++;
    this.updateDisplayedDays(false);
    this.updateMustToBeVisibleElementId();
  }

  public goPrevPage(): void {
    if(!this.isExistPrevPage()) return;
    this.currentPage--;
    this.updateDisplayedDays(false);
    this.updateMustToBeVisibleElementId();
  }

  public isExistNextPage(): boolean {
    const elementsPerPage: number = this.calcDaysToDisplay();
    const initElementIndex: number = Math.floor(this.currentPage * elementsPerPage);
    return (initElementIndex + elementsPerPage) < this.days.length;
  }

  public isExistPrevPage(): boolean {
    return this.currentPage > 0;
  }

  public getDayTracker(index: number, day: Day): number {
    return day.id;
  } 
}