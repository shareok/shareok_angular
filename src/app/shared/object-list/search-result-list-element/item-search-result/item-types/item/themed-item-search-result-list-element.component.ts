import { Component, Input } from '@angular/core';
import { ThemedComponent } from '../../../../../theme-support/themed.component'; 
import { ItemSearchResultListElementComponent } from './item-search-result-list-element.component'; 
import { CollectionElementLinkType } from 'src/app/shared/object-collection/collection-element-link.type';
import { Item } from 'src/app/core/shared/item.model';

@Component({
  selector: 'ds-themed-item-search-result-list-element',
  styleUrls: [],
  templateUrl: '../../../../../theme-support/themed.component.html'
})
/**
 * Themed wrapper for ItemSearchResultListElementComponent
 */
export class ThemedItemSearchResultListElementComponent extends ThemedComponent<ItemSearchResultListElementComponent> {

    @Input() showLabel: boolean;
    @Input() object: Item;
    @Input() linkType: CollectionElementLinkType;
    protected inAndOutputNames: (keyof ItemSearchResultListElementComponent & keyof this)[] = ['showLabel', 'object', 'linkType'];
  
    protected getComponentName(): string {
      return 'ItemSearchResultListElementComponent';
      }
    
      protected importThemedComponent(themeName: string): Promise<any> {
        console.log("Themed item search:");
        console.log(this.showLabel);
        console.log(themeName);
        console.log('importThemedComponent');
  
        return import(`../../../../../../../themes/${themeName}/app/shared/object-list/search-result-list-element/item-search-result/item-types/item/item-search-result-list-element.component`);
      }
    
      protected importUnthemedComponent(): Promise<any> {
        console.log("Item search:");
        console.log(this.showLabel);
        console.log('importUnthemedComponent');
  
        return import(`./item-search-result-list-element.component`);
      }

}
