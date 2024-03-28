import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SelectorComponent } from './selector.component';
import { Component, DebugElement } from '@angular/core';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { Day } from './day';
import { By } from '@angular/platform-browser';

@Component({
  template: `
    <form [formGroup]="form" novalidate (ngSubmit)="handleSubmit()">
      <app-selector
        [days]="days"
        formControlName="selectedDays">
      </app-selector>
      <button type="submit">save</button>
    </form>
  `
})
class TestComponent {
  days: Array<Day> = [
    new Day(1, new Date('2024-01-01T12:00:00.000Z')),
    new Day(2, new Date('2024-01-02T12:00:00.000Z')),
    new Day(3, new Date('2024-02-03T12:00:00.000Z')),
    new Day(4, new Date('2024-02-04T12:00:00.000Z')),
    new Day(5, new Date('2024-03-05T12:00:00.000Z')),
    new Day(6, new Date('2024-03-06T12:00:00.000Z')),
    new Day(7, new Date('2024-04-07T12:00:00.000Z')),
    new Day(8, new Date('2024-04-08T12:00:00.000Z')),
    new Day(9, new Date('2024-05-09T12:00:00.000Z')),
    new Day(10, new Date('2024-05-10T12:00:00.000Z')),
    new Day(11, new Date('2024-06-11T12:00:00.000Z')),
    new Day(12, new Date('2024-06-12T12:00:00.000Z')),
    new Day(13, new Date('2024-07-13T12:00:00.000Z')),
    new Day(14, new Date('2024-07-14T12:00:00.000Z')),
    new Day(15, new Date('2024-08-15T12:00:00.000Z')),
    new Day(16, new Date('2024-08-16T12:00:00.000Z')),
    new Day(17, new Date('2024-09-17T12:00:00.000Z')),
    new Day(18, new Date('2024-09-18T12:00:00.000Z')),
    new Day(19, new Date('2024-10-19T12:00:00.000Z')),
    new Day(20, new Date('2024-10-20T12:00:00.000Z')),
    new Day(21, new Date('2024-11-21T12:00:00.000Z')),
    new Day(22, new Date('2024-11-22T12:00:00.000Z')),
    new Day(23, new Date('2024-12-23T12:00:00.000Z')),
  ];

  form: FormGroup = this.formBuilder.group({
    selectedDays: [[this.days[0]]]
  });

  constructor(private formBuilder: FormBuilder) {}

  handleSubmit():void{}
}

describe('SelectorComponent', () => {
  let component: DebugElement;
  let fixture: ComponentFixture<TestComponent>;

  beforeEach( async () => {
    TestBed.configureTestingModule({
      imports:[
        FormsModule,
        ReactiveFormsModule
      ],
      declarations: [ 
        SelectorComponent,
        TestComponent
      ]
    })
    .compileComponents();
  });

  beforeAll(() => {
    spyOnProperty(window, 'innerWidth').and.returnValue(760);
  })

  beforeEach(() => {
    fixture = TestBed.createComponent(TestComponent);
    component = fixture.debugElement.query(By.css("app-selector"));
    fixture.detectChanges();
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });

  it('Cuando se inicia el componente su cargan y muestran los dias correctamente', async() => {
    fixture.detectChanges();
    await fixture.whenStable();
    fixture.detectChanges();
    await fixture.whenRenderingDone();

    const slider: DebugElement = component.query(By.css(".daysSlider"));
    const renderedDays = Array.from(slider.nativeElement.querySelectorAll("header .dayElement .day"))
      .map(dayEl => (dayEl as HTMLElement).innerText);
    const renderedMonths = Array.from(slider.nativeElement.querySelectorAll("header .dayElement .month"))
      .map(dayEl => (dayEl as HTMLElement).innerText);

    expect(renderedDays.slice(0, 5)).toEqual(['1', '2', '3', '4', '5'])
    expect(renderedMonths.slice(0, 5)).toEqual(['Jan', 'Jan', 'Feb', 'Feb', 'Mar'])
  })

  it('Cuando se inicia el componente se muestran tantos dias como quepan en la pantalla', async() => {
    spyOnProperty(component.query(By.css(".daysSlider")).nativeElement, "clientWidth").and.returnValue(760);
    fixture.detectChanges();
    await fixture.whenStable();

    const displayedDaysCount = component.componentInstance.displayedDays.length;
    const totalDaysCount = component.componentInstance.days.length; 
    expect(displayedDaysCount).toBeLessThan(totalDaysCount);
    expect(totalDaysCount).toBe(23);
    expect(displayedDaysCount).toBe(15);
  })

  it('Cuando se redimensiona la pantalla se ajusta el numero de elementos', async() => {
    fixture.detectChanges();
    await fixture.whenStable();

    const oldDisplayedDaysCount = component.componentInstance.displayedDays.length;
    spyOnProperty(component.query(By.css(".daysSlider")).nativeElement, "clientWidth").and.returnValue(760);
    window.dispatchEvent(new Event('resize'));
    fixture.detectChanges();
    await fixture.whenStable();

    const newDisplayedDaysCount = component.componentInstance.displayedDays.length;
    expect(newDisplayedDaysCount).toBeLessThan(oldDisplayedDaysCount);
  })

  it('Cuando se hace click en un elemento si no esta seleccionado se muestra como seleccionado y viceversa', async() => {
    fixture.detectChanges();
    await fixture.whenStable();
    fixture.detectChanges();
    await fixture.whenRenderingDone();

    const oldRenderedElements = getRenderedElements(component);
    const oldSelectedElementsIndexs = getRenderedSelectedElementsIndex(component);
    oldRenderedElements.slice(0, 4).forEach(el => el.click());
    fixture.detectChanges();
    await fixture.whenStable();
    
    const newSelectedElementsIndexs = getRenderedSelectedElementsIndex(component);
    expect(oldSelectedElementsIndexs).toEqual([0]);
    expect(newSelectedElementsIndexs).toEqual([1,2,3]);
  });

  it('Cuando se seleccionan elementos de varias paginas y se guarda son recuperados todos los elementos de todas las paginas', async() => {
    spyOnProperty(component.query(By.css(".daysSlider")).nativeElement, "clientWidth").and.returnValue(500);
    fixture.detectChanges();
    await fixture.whenStable();
    fixture.detectChanges();
    await fixture.whenRenderingDone();

    const pageOneElements = getRenderedElements(component);
    pageOneElements.slice(1, 2).forEach(el => el.click());
    component.query(By.css(".nextPageButton")).nativeElement.click();
    fixture.detectChanges();
    await fixture.whenStable();

    const pageTwoElements = getRenderedElements(component);
    pageTwoElements.slice(1, 2).forEach(el => el.click());
    fixture.debugElement.query(By.css("button")).nativeElement.click();

    const formSelectedValuesIds = fixture.componentInstance.form.value.selectedDays.map((day: Day) => day.id);
    expect(formSelectedValuesIds).toEqual([1, 2, 12]);
  });

});

function getRenderedElements(component: DebugElement): Array<HTMLElement>{
  const slider: DebugElement = component.query(By.css(".daysSlider"));
  return Array.from(slider.nativeElement.querySelectorAll("header .dayElement"));
}

function getRenderedSelectedElementsIndex(component: DebugElement): Array<number> {
  const renderedElements = getRenderedElements(component);
  return renderedElements
    .map(el => el.className.replace("dayElement ", ""))
    .reduce((acc: Array<number>, curr: string, index: number) => {
      if(curr === "selectedDay") acc.push(index);
      return acc;
    }, []);
}