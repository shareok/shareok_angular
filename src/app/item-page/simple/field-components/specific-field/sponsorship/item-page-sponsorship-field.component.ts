import { Component, Input, OnInit } from '@angular/core';

import { Item } from '../../../../../core/shared/item.model';
import { ItemPageFieldComponent } from '../item-page-field.component';
import { BehaviorSubject, Observable, combineLatest } from 'rxjs';
import { map, startWith } from 'rxjs/operators';
import { Collection } from 'src/app/core/shared/collection.model';
import { CollectionDataService } from 'src/app/core/data/collection-data.service';
import { getFirstSucceededRemoteDataPayload } from 'src/app/core/shared/operators';
import { hasValue } from 'src/app/shared/empty.util';
import { BrowseDefinitionDataService } from 'src/app/core/browse/browse-definition-data.service';

@Component({
    selector: 'ds-item-page-sponsorship-field',
    templateUrl: './item-page-sponsorship-field.component.html'
})
/**
 * This component is used for displaying the sponsorship (dc.description.sponsorship) of an item
 */
export class ItemPageSponsorshipFieldComponent extends ItemPageFieldComponent implements OnInit {

    /**
     * The item to display metadata for
     */
    @Input() item: Item;

    collections$: Observable<Collection[]>;

    loadMore$: BehaviorSubject<void> = new BehaviorSubject(undefined);

    pageSize = 5;

    /**
     * Separator string between multiple values of the metadata fields defined
     * @type {string}
     */
    separator: string;

    /**
     * Fields (schema.element.qualifier) used to render their values.
     * In this component, we want to display values for metadata 'dc.description.sponsorship'
     */
    fields: string[] = [
        'dc.description.sponsorship'
    ];

    /**
     * Label i18n key for the rendered metadata
     */
    label = 'item.description-ou.sponsorship';

    /**
     * Use the {@link MarkdownPipe} to render dc.description.sponsorship values
     */
    enableMarkdown = true;

    constructor(public browseDefinitionDataService: BrowseDefinitionDataService, private cds: CollectionDataService) {
        super(browseDefinitionDataService);
    }
    
    ngOnInit(): void {
        const owningCollection$: Observable<Collection> = this.cds.findOwningCollectionFor(this.item).pipe(
          getFirstSucceededRemoteDataPayload(),
          startWith(null as Collection),
        );
    
        const mappedCollections$: Observable<Collection[]> = this.loadMore$.pipe(    
          startWith([]),
        ) as Observable<Collection[]>;
    
        this.collections$ = combineLatest([owningCollection$, mappedCollections$]).pipe(
          map(([owningCollection, mappedCollections]: [Collection, Collection[]]) => {
            return [owningCollection, ...mappedCollections].filter(collection => hasValue(collection));
          }),
        );
      }    
}
