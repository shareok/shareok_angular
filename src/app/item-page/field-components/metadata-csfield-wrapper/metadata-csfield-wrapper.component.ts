import { Component, Input } from '@angular/core';

/**
 * This component renders any content inside this wrapper.
 * The wrapper prints a label before the content (if available)
 */
@Component({
  selector: 'ds-metadata-csfield-wrapper',
  styleUrls: ['./metadata-csfield-wrapper.component.scss'],
  templateUrl: './metadata-csfield-wrapper.component.html'
})
export class MetadataCSFieldWrapperComponent {

  /**
   * The label (title) for the content 
   */
  @Input() label: string;

  @Input() hideIfNoTextContent = true;
}
