import { ChangeDetectionStrategy, Component, EventEmitter, Input, OnInit, Output, QueryList } from '@angular/core';
import { UntypedFormGroup } from '@angular/forms';
import {
  DynamicFormControlComponent,
  DynamicFormControlCustomEvent,
  DynamicFormControlEvent,
  DynamicFormControlLayout,
  DynamicFormControlModel,
  DynamicFormGroupModel,
  DynamicFormLayout,
  DynamicFormLayoutService,
  DynamicFormValidationService,
  DynamicTemplateDirective
} from '@ng-dynamic-forms/core';

@Component({
  selector: 'ds-dynamic-form-group',
  templateUrl: './dynamic-form-group.component.html',
  changeDetection: ChangeDetectionStrategy.Default
})
export class DsDynamicFormGroupComponent extends DynamicFormControlComponent implements OnInit{

  @Input() formModel: DynamicFormControlModel[];
  @Input() formLayout: DynamicFormLayout;
  @Input() group: UntypedFormGroup;
  @Input() layout: DynamicFormControlLayout;
  @Input() model: DynamicFormGroupModel;
  @Input() templates: QueryList<DynamicTemplateDirective> | DynamicTemplateDirective[] | undefined;

  /* eslint-disable @angular-eslint/no-output-rename */
  @Output('dfBlur') blur: EventEmitter<DynamicFormControlEvent> = new EventEmitter<DynamicFormControlEvent>();
  @Output('dfChange') change: EventEmitter<DynamicFormControlEvent> = new EventEmitter<DynamicFormControlEvent>();
  @Output('dfFocus') focus: EventEmitter<DynamicFormControlEvent> = new EventEmitter<DynamicFormControlEvent>();
  @Output('ngbEvent') customEvent: EventEmitter<DynamicFormControlCustomEvent> = new EventEmitter();
  /* eslint-enable @angular-eslint/no-output-rename */

  constructor(protected layoutService: DynamicFormLayoutService,
              protected validationService: DynamicFormValidationService) {

    super(layoutService, validationService);
  }

  ngOnInit(): void {
    if(this.model.id === 'accessConditionGroup') {
      if(this.model.group.length === 3) {
        for(let i=0; i<this.model.group.length; i++) {
          if(this.model.group[i].id === 'endDate') {
            this.model.group[i].hidden = true;
          }
          if(this.model.group[i].id === 'startDate') {
            this.model.group[i].layout.grid.host = 'col-12';
          }
        }
      }
    }
  }
}
