import { Component, OnInit, Renderer2, Input } from '@angular/core';
import { Item } from '../../../../../../../../app/core/shared/item.model';
import { MetadataValue } from 'src/app/core/shared/metadata.models';
// import { ItemPageFieldComponent } from '../../../../../../app/item-page/simple/field-components/specific-field/item-page-field.component';

@Component({
  selector: 'ds-altmetric-badge-field',
  styleUrls: ['./almetric-badge.component.scss'],
  templateUrl: './almetric-badge.component.html',
})
export class AlmetricBadgeComponent implements OnInit {

  @Input() item: Item;
  @Input() fields: string[];

  public metadataValue = [] as MetadataValue[];

  constructor(private renderer: Renderer2) {}

  ngOnInit() {
    this.metadataValue = this.item?.allMetadata(this.fields);

    const script = this.renderer.createElement('script');
    script.src = `https://d1bxh8uas1mnw7.cloudfront.net/assets/embed.js`;
    this.renderer.appendChild(document.head, script);
  }
}
