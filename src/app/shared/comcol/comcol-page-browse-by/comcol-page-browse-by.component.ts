import { Component, Input, OnInit } from '@angular/core';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { ActivatedRoute, Params, Router } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';
import { getCommunityPageRoute } from '../../../community-page/community-page-routing-paths';
import { getCollectionPageRoute } from '../../../collection-page/collection-page-routing-paths';
import { getFirstCompletedRemoteData } from '../../../core/shared/operators';
import { PaginatedList } from '../../../core/data/paginated-list.model';
import { BrowseDefinition } from '../../../core/shared/browse-definition.model';
import { RemoteData } from '../../../core/data/remote-data';
import { BrowseService } from '../../../core/browse/browse.service';
import { HandleService } from '../../handle.service';

export interface ComColPageNavOption {
  id: string;
  label: string;
  routerLink: string;
  params?: any;
}

/**
 * A component to display the "Browse By" section of a Community or Collection page
 * It expects the ID of the Community or Collection as input to be passed on as a scope
 */
@Component({
  selector: 'ds-comcol-page-browse-by',
  styleUrls: ['./comcol-page-browse-by.component.scss'],
  templateUrl: './comcol-page-browse-by.component.html'
})
export class ComcolPageBrowseByComponent implements OnInit {
  /**
   * The ID of the Community or Collection
   */
  @Input() id: string;
  @Input() contentType: string;
  // The handle of the Community or Collection
  @Input() content: string;

  allOptions: ComColPageNavOption[];

  currentOptionId$: Observable<string>;

  normalHandle: string;

  constructor(
    protected route: ActivatedRoute,
    protected router: Router,
    protected browseService: BrowseService,
    protected translate: TranslateService
  ) {
  }

  ngOnInit(): void {
    this.browseService.getBrowseDefinitions()
      .pipe(getFirstCompletedRemoteData<PaginatedList<BrowseDefinition>>())
      .subscribe((browseDefListRD: RemoteData<PaginatedList<BrowseDefinition>>) => {
        if (browseDefListRD.hasSucceeded) {
          this.allOptions = browseDefListRD.payload.page
            .map((config: BrowseDefinition) => ({
              id: config.id,
              label: `browse.comcol.by.${config.id}`,
              routerLink: `/browse/${config.id}`,
              params: { scope: this.id }
            }));
          if (this.contentType === 'collection') {
            this.allOptions = [{
              id: this.id,
              label: 'collection.page.browse.recent.head',
              routerLink: getCollectionPageRoute(this.id)
            }, ...this.allOptions];
          } else if (this.contentType === 'community') {
            this.allOptions = [{
              id: this.id,
              label: 'community.all-lists.head',
              routerLink: getCommunityPageRoute(this.id)
            }, ...this.allOptions];
          }

          this.allOptions = this.allOptions.filter(this.filterCommons);

          // Not OU Community
          if(this.id !== 'e781c503-6d9f-49b0-923b-2a96a35c90e2') {
            this.allOptions = this.allOptions.filter(this.filterUndergarduateContent);
          }
          // Not CS Collection
          if(this.id !== 'a7693079-f4e3-400b-8ed1-2ffb80b8e550') {
            this.allOptions = this.allOptions.filter(this.filterCsBrowses);
          } else {
            this.allOptions = this.allOptions.filter(this.unfilterCsBrowses);
          }
        }
      });

    this.currentOptionId$ = this.route.params.pipe(
      map((params: Params) => params.id)
    );
  }

  onSelectChange(newId: string) {
    const selectedOption = this.allOptions
      .find((option: ComColPageNavOption) => option.id === newId);

    this.router.navigate([selectedOption.routerLink], { queryParams: selectedOption.params });
  }

  filterCsBrowses(option: ComColPageNavOption) {
    if(option.id === 'sampleid' || option.id === 'city' || option.id === 'state' || option.id === 'zip') {
      return false;
    }
    return true;
  }

  unfilterCsBrowses(option: ComColPageNavOption) {
    if(option.id === 'sampleid' || option.id === 'city' || option.id === 'state' || option.id === 'zip') {
      return true;
    }
    return false;
  }

  filterCommons(option: ComColPageNavOption) {
    if(option.id === 'srsc' || option.id === 'subjects') {
      return false;
    }
    return true;
  }

  filterUndergarduateContent(option: ComColPageNavOption) {
    if(option.id === 'undergraduate') {
      return false;
    }
    return true;
  }
}
