import { Component, Input, OnInit } from '@angular/core';
import { Item } from 'src/app/core/shared/item.model';
import { CSGenericItemPageFieldComponent } from 'src/app/item-page/simple/field-components/specific-field/csgeneric/csgeneric-item-page-field.component';

@Component({
  selector: 'ds-csitem-simple-info',
  styleUrls: ['./csitem-simple-info.component.scss'],
  templateUrl: './csitem-simple-info.component.html',
})
export class CsItemSimpleInfoNoteComponent implements OnInit {

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

  detail: string;
  city: string;
  state: string;
  zip: string;
  internalcode: string;
  isolatesfromrbm: string;
  isolatesfromtv8: string;
  sampleid: string;
  imagestatus: string;
  taxonomy: string[];

  ngOnInit() {
    this.detail = this.getDetail();
    this.city = this.getCity();
    this.state = this.getState();
    this.zip = this.getZip();
    this.internalcode = this.getInternalcode();
    this.isolatesfromrbm = this.getIsolatesfromrbm();
    this.isolatesfromtv8 = this.getIsolatesfromtv8();
    this.sampleid = this.getSampleid();
    this.imagestatus = this.getImagestatus();
    this.taxonomy = this.getTaxonomy();
    }

  getDetail() {
    return this.item.firstMetadataValue('dwc.npdg.detail');
  }
  getCity() {
    return this.item.firstMetadataValue('dwc.npdg.homecity');
  }
  getState() {
    return this.item.firstMetadataValue('dwc.npdg.homestate');
  }
  getZip() {
    return this.item.firstMetadataValue('dwc.npdg.homezip');
  }
  getInternalcode() {
    return this.item.firstMetadataValue('dwc.npdg.internalcode');
  }
  getIsolatesfromrbm() {
    return this.item.firstMetadataValue('dwc.npdg.isolatesRBM');
  }
  getIsolatesfromtv8() {
    return this.item.firstMetadataValue('dwc.npdg.isolatesTV8');
  }
  getSampleid() {
    return this.item.firstMetadataValue('dwc.npdg.sampleid');
  }
  getImagestatus() {
    return this.item.firstMetadataValue('dwc.npdg.imagestatus');
  }
  getTaxonomy() {
    // const wiki = this.item.firstMetadataValue('dc.relation.wiki');
    const wikis = this.item.allMetadataValues('dc.relation.wiki')
    console.log(JSON.stringify(wikis));
    return wikis;
  }

}
    // <table class="table table-striped table-hover">
    //     <tbody>
    //         <ds-csgeneric-item-page-field [item]="item" [fields]="['dwc.npdg.detail']"
    //             [label]="'item.page.Legend.collectiondetail'">
    //         </ds-csgeneric-item-page-field>
    //         <ds-csgeneric-item-page-field [item]="item" [fields]="['dwc.npdg.homecity']"
    //             [label]="'item.page.Legend.city'">
    //         </ds-csgeneric-item-page-field>
    //         <ds-csgeneric-item-page-field [item]="item" [fields]="['dwc.npdg.homestate']"
    //             [label]="'item.page.Legend.state'">
    //         </ds-csgeneric-item-page-field>
    //         <ds-csgeneric-item-page-field [item]="item" [fields]="['dwc.npdg.homezip']"
    //             [label]="'item.page.Legend.zip'">
    //         </ds-csgeneric-item-page-field>
    //         <ds-csgeneric-item-page-field [item]="item" [fields]="['dwc.npdg.internalcode']"
    //             [label]="'item.page.Legend.internalcode'">
    //         </ds-csgeneric-item-page-field>
    //         <ds-csgeneric-item-page-field [item]="item" [fields]="['dwc.npdg.isolatesRBM']"
    //             [label]="'item.page.Legend.isolatesfromrbm'">
    //         </ds-csgeneric-item-page-field>
    //         <ds-csgeneric-item-page-field [item]="item" [fields]="['dwc.npdg.isolatesTV8']"
    //             [label]="'item.page.Legend.isolatesfromtv8'">
    //         </ds-csgeneric-item-page-field>
    //         <ds-csgeneric-item-page-field [item]="item" [fields]="['dwc.npdg.sampleid']"
    //             [label]="'item.page.Legend.sampleid'">
    //         </ds-csgeneric-item-page-field>
    //         <ds-csgeneric-item-page-field [item]="item" [fields]="['dwc.npdg.imagestatus']"
    //             [label]="'item.page.Legend.imagestatus'">
    //         </ds-csgeneric-item-page-field>
    //         <ds-csgeneric-item-page-field [item]="item" [fields]="['dc.relation.wiki']"
    //             [label]="'item.page.Legend.taxonomy'">
    //         </ds-csgeneric-item-page-field>
    //     </tbody>
    // </table>