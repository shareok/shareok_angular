import { Component, Input } from '@angular/core';

import { MetadataValuesComponent } from '../metadata-values/metadata-values.component';
import { MetadataValue } from '../../../core/shared/metadata.models';

/**
 * This component renders the configured 'values' into the ds-metadata-field-wrapper component as a link.
 * It puts the given 'separator' between each two values
 * and creates an 'a' tag for each value,
 * using the 'linktext' as it's value (if it exists)
 * and using the values as the 'href' attribute (and as value of the tag when no 'linktext' is defined)
 */
@Component({
  selector: 'ds-metadata-uri-doi-values',
  templateUrl: './metadata-uri-doi-values.component.html'
})
export class MetadataUriDoiValuesComponent extends MetadataValuesComponent {

  /**
   * Optional text to replace the links with
   * If undefined, the metadata value (uri) is displayed
   */
  @Input() linktext: any;

  /**
   * The metadata values to display
   */
  @Input() mdValues: MetadataValue[];

  /**
   * The seperator used to split the metadata values (can contain HTML)
   */
  @Input() separator: string;

  /**
   * The label for this iteration of metadata values
   */
  @Input() label: string;

  isIdentifierDoi: boolean;

  private doiUrl = "https://doi.org/";

  getDoiUrl(doi: string) {
    if(doi.includes('doi.org')) {
      doi = doi.split('doi.org/')[1]
    }
    return this.doiUrl + doi;
  }

}
