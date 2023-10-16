import { Component, Inject, Input, OnInit } from '@angular/core';
import { SearchService } from '../../../core/shared/search/search.service';
import { SortDirection, SortOptions } from '../../../core/cache/models/sort-options.model';
import { ActivatedRoute, Router } from '@angular/router';
import { SearchConfigurationService } from '../../../core/shared/search/search-configuration.service';
import { SEARCH_CONFIG_SERVICE } from '../../../my-dspace-page/my-dspace-page.component';
import { PaginationService } from '../../../core/pagination/pagination.service';

@Component({
  selector: 'ds-search-settings',
  styleUrls: ['./search-settings.component.scss'],
  templateUrl: './search-settings.component.html'
})

/**
 * This component represents the part of the search sidebar that contains the general search settings.
 */
export class SearchSettingsComponent implements OnInit {
  /**
   * The current sort option used
   */
  @Input() currentSortOption: SortOptions;

  /**
   * All sort options that are shown in the settings
   */
  @Input() sortOptionsList: SortOptions[];

  @Input() currentConfiguration;

  constructor(private service: SearchService,
              private route: ActivatedRoute,
              private router: Router,
              private paginationService: PaginationService,
              @Inject(SEARCH_CONFIG_SERVICE) public searchConfigurationService: SearchConfigurationService) {
  }

  ngOnInit(): void {
    if(this.currentConfiguration === 'workspace') {
      this.currentSortOption = new SortOptions('dc.date.issued', SortDirection.DESC);
      this.workflowInitloadOrder();
    }
  }

  /**
   * Method to change the current sort field and direction
   * @param {Event} event Change event containing the sort direction and sort field
   */
  reloadOrder(event: Event) {
    const values = (event.target as HTMLInputElement).value.split(',');
    this.paginationService.updateRoute(this.searchConfigurationService.paginationID, {
      sortField: values[0],
      sortDirection: values[1] as SortDirection,
      page: 1
    });
  }

  workflowInitloadOrder() {
    this.paginationService.updateRoute(this.searchConfigurationService.paginationID, {
      sortField: 'dc.date.issued',
      sortDirection: SortDirection.DESC,
      page: 1
    });
  }

}
