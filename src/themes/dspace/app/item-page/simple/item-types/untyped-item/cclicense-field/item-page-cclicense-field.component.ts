import { Component, OnInit, Input, AfterViewInit} from '@angular/core';
import { Item } from '../../../../../../../../app/core/shared/item.model';

@Component({
  selector: 'ds-item-page-cclicense-field',
  styleUrls: ['./item-page-cclicense-field.component.scss'],
  templateUrl: './item-page-cclicense-field.component.html',
})
/**
 * This component can be used to represent any uri on a simple item page.
 * It expects 4 parameters: The item, a separator, the metadata keys and an i18n key
 */
export class ItemPageCclicenseFieldComponent implements OnInit, AfterViewInit {
  ngAfterViewInit(): void {
    throw new Error('Method not implemented.');
  }
  /**
   * The item to display metadata for
   */
  @Input() item: Item;

  /**
   * Separator string between multiple values of the metadata fields defined
   * @type {string}
   */
  @Input() separator: string;

  /**
   * Fields (schema.element.qualifier) used to render their values.
   */
  @Input() fields: string[];

  /**
   * Label i18n key for the rendered metadata
   */
  @Input() label: string;

  cclUri: string; 
  cclicense: string;
  iconSrc: string;
  hasCCLicenses: boolean;

  cclicenses = [
    {id: 0, license: 'zero'},
    {id: 1, license: 'by'},
    {id: 2, license: 'by-sa'},
    {id: 3, license: 'by-nd'},
    {id: 4, license: 'by-nc'},
    {id: 5, license: 'by-nc-sa'},
    {id: 6, license: 'by-nc-nd'}
  ];

  ngOnInit(): void {
    this.cclUri = this.item?.allMetadata('dc.rights.uri')[0].value;
    this.cclicense = this.item?.allMetadata('dc.rights')[0].value;
    this.iconSrc = this.getIcon();
    this.hasCCLicenses = !this.cclUri? false: true;

  }

  getIcon() {
    let iconSrc = '';
    const prefix1 = 'licenses/';
    const prefix2 = 'publicdomain/'
    const base = '/assets/dspace/images/creativecommons/cc-';
    for (let i=0; i< this.cclicenses.length; i++) {
      if (this.cclUri.includes(prefix1 + this.cclicenses[i].license) || this.cclUri.includes(prefix2 + this.cclicenses[i].license)) {
        iconSrc = base + this.cclicenses[i].license + '.png';
      }
    }
    return iconSrc;
  }
}