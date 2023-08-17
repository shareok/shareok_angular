import { Component, Inject } from '@angular/core';
import { Observable, of as observableOf, Subscription } from 'rxjs';
import { Field, Option, SubmissionCcLicence } from '../../../core/submission/models/submission-cc-license.model';
import {
  getFirstCompletedRemoteData,
  getFirstSucceededRemoteData,
  getRemoteDataPayload
} from '../../../core/shared/operators';
import { distinctUntilChanged, filter, map, take } from 'rxjs/operators';
import { SubmissionCcLicenseDataService } from '../../../core/submission/submission-cc-license-data.service';
import { NgbModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import { renderSectionFor } from '../sections-decorator';
import { SectionsType } from '../sections-type';
import { SectionModelComponent } from '../models/section.model';
import { SectionDataObject } from '../models/section-data.model';
import { SectionsService } from '../sections.service';
import { WorkspaceitemSectionCcLicenseObject } from '../../../core/submission/models/workspaceitem-section-cc-license.model';
import { JsonPatchOperationPathCombiner } from '../../../core/json-patch/builder/json-patch-operation-path-combiner';
import { isNotEmpty } from '../../../shared/empty.util';
import { JsonPatchOperationsBuilder } from '../../../core/json-patch/builder/json-patch-operations-builder';
import { SubmissionCcLicenseUrlDataService } from '../../../core/submission/submission-cc-license-url-data.service';
import {ConfigurationDataService} from '../../../core/data/configuration-data.service';

/**
 * This component represents the submission section to select the Creative Commons license.
 */
@Component({
  selector: 'ds-submission-section-cc-licenses',
  templateUrl: './submission-section-cc-licenses.component.html',
  styleUrls: ['./submission-section-cc-licenses.component.scss']
})
@renderSectionFor(SectionsType.CcLicense)
export class SubmissionSectionCcLicensesComponent extends SectionModelComponent {

  /**
   * The form id
   * @type {string}
   */
  public formId: string;

  /**
   * A boolean representing if this section is loading
   * @type {boolean}
   */
  public isLoading = true;

  /**
   * The [JsonPatchOperationPathCombiner] object
   * @type {JsonPatchOperationPathCombiner}
   */
  protected pathCombiner: JsonPatchOperationPathCombiner;

  /**
   * The list of Subscriptions this component subscribes to.
   */
  private subscriptions: Subscription[] = [];

  /**
   * Cache of the available Creative Commons licenses.
   */
  submissionCcLicenses: SubmissionCcLicence[];

  /**
   * Reference to NgbModal
   */
  protected modalRef: NgbModalRef;

  /**
   * Default jurisdiction configured
   */
  defaultJurisdiction: string;

  selectChoice: string;

  existinglinkType: string;

  CC_CHOOSERS = [
    {id: 0, choice: 'I already know which Creative Commons license I want to apply'},
    {id: 1, choice: 'I want to use the Creative Commons license chooser'},
    {id: 2, choice: 'I do not wish to apply a Creative Commons license at this time'}
  ];

  hidelink: boolean;

  /**
   * The Creative Commons link saved in the workspace item.
   */
  get storedCcLicenseLink(): string {
    return this.data.uri;
  }

  /**
   * The accepted state for the selected Creative Commons license.
   */
  get accepted(): boolean {
    if (this.data.accepted === undefined) {
      return !!this.data.uri;
    }
    return this.data.accepted;
  }

  constructor(
    protected modalService: NgbModal,
    protected sectionService: SectionsService,
    protected submissionCcLicensesDataService: SubmissionCcLicenseDataService,
    protected submissionCcLicenseUrlDataService: SubmissionCcLicenseUrlDataService,
    protected operationsBuilder: JsonPatchOperationsBuilder,
    protected configService: ConfigurationDataService,
    @Inject('collectionIdProvider') public injectedCollectionId: string,
    @Inject('sectionDataProvider') public injectedSectionData: SectionDataObject,
    @Inject('submissionIdProvider') public injectedSubmissionId: string
  ) {
    super(
      injectedCollectionId,
      injectedSectionData,
      injectedSubmissionId,
    );
  }

  /**
   * The data of this section.
   */
  get data(): WorkspaceitemSectionCcLicenseObject {
    return this.sectionData.data as WorkspaceitemSectionCcLicenseObject;
  }

  /**
   * Select a given Creative Commons license.
   * @param ccLicense the Creative Commons license to select.
   */
  selectCcLicense(ccLicense: SubmissionCcLicence) {
    if (!!this.getSelectedCcLicense() && this.getSelectedCcLicense().id === ccLicense.id) {
      return;
    }
    this.setAccepted(false);
    this.updateSectionData({
      ccLicense: {
        id: ccLicense.id,
        fields: {},
      },
      uri: undefined,
    });
  }

  onSelectChoice(id: number) {
    if(id === 0){
      this.selectChoice = 'c0';
      this.getExitingChooser();
      this.hidelink = false;
    }
    if(id === 1){
      this.selectChoice = 'c1';
      this.hidelink = false;
    }
    if(id === 2){
      this.selectChoice = 'c2';
      this.setAccepted(false);
      this.hidelink = true;
    }
  }

  /**
   * Get the selected Creative Commons license.
   */
  getSelectedCcLicense(): SubmissionCcLicence {
    if (!this.submissionCcLicenses || !this.data.ccLicense) {
      return null;
    }
    return this.submissionCcLicenses.filter((ccLicense) => ccLicense.id === this.data.ccLicense.id)[0];
  }

  /**
   * Select an option for a given license field.
   * @param ccLicense   the related Creative Commons license.
   * @param field       the field for which to select an option.
   * @param option      the option to select.
   */
  selectOption(ccLicense: SubmissionCcLicence, field: Field, option: Option) {
    if (this.isSelectedOption(ccLicense, field, option)) {
      return;
    }
    this.updateSectionData({
      ccLicense: {
        id: ccLicense.id,
        fields: Object.assign({}, this.data.ccLicense.fields, {
          [field.id]: option
        }),
      },
      accepted: false,
    });
  }

  selectChooser(ccLicense: SubmissionCcLicence, field: Field, option: Option) {
    if(!this.data.ccLicense?.fields) {
      this.updateSectionData({
        ccLicense: {
          id: ccLicense.id,
          fields: {},
        },
        uri: undefined,
      });
    }

    this.setAccepted(false);
    this.updateSectionData({
      ccLicense: {
        id: ccLicense.id,
        fields: Object.assign({}, this.data.ccLicense.fields, {
          [field.id]: option
        }),
      },
      accepted: false,
    });
  }

  /**
   * Get the selected option for a given license field.
   * @param ccLicense   the related Creative Commons license.
   * @param field       the field for which to get the selected option value.
   */
  getSelectedOption(ccLicense: SubmissionCcLicence, field: Field): Option {
    if (field.id === 'jurisdiction' && this.defaultJurisdiction !== undefined && this.defaultJurisdiction !== 'none') {
      return field.enums.find(option => option.id === this.defaultJurisdiction);
    }
    return this.data.ccLicense.fields[field.id];
  }

  /**
   * Whether a given option is selected for a given Creative Commons license field.
   * @param ccLicense   the related Creative Commons license.
   * @param field       the field for which to check whether the option is selected.
   * @param option      the option for which to check whether it is selected.
   */
  isSelectedOption(ccLicense: SubmissionCcLicence, field: Field, option: Option): boolean {
    return this.getSelectedOption(ccLicense, field) && this.getSelectedOption(ccLicense, field).id === option.id;
  }

  selectedChooser(): string {
    if(Object.keys(this.data.ccLicense.fields).length===0 && this.data.ccLicense.id==='zero' ) {
      return 'cc0';
    } else if(this.data.ccLicense.fields['commercial'] && this.data.ccLicense.fields['derivatives']) {
      if (this.data.ccLicense.fields['commercial'].id === 'y' && this.data.ccLicense.fields['derivatives'].id === 'y') {
        return 'cc1';
      } else if (this.data.ccLicense.fields['commercial'].id === 'y' && this.data.ccLicense.fields['derivatives'].id === 'sa') {
        return 'cc2';
      } else if (this.data.ccLicense.fields['commercial'].id === 'n' && this.data.ccLicense.fields['derivatives'].id === 'y') {
        return 'cc3';
      } else if (this.data.ccLicense.fields['commercial'].id === 'y' && this.data.ccLicense.fields['derivatives'].id === 'n') {
        return 'cc4';
      } else if (this.data.ccLicense.fields['commercial'].id === 'n' && this.data.ccLicense.fields['derivatives'].id === 'sa') {
        return 'cc5';
      } else if (this.data.ccLicense.fields['commercial'].id === 'n' && this.data.ccLicense.fields['derivatives'].id === 'n') {
        return 'cc6';
      }
    }
    return null;
  }

  getExitingChooser() {
    // this.getCcLicenseLink$().subscribe(link => this.getExistingLicenseType(link));
    this.getCcLicenseLink$().pipe(
      take(1),
    ).subscribe(() => {
      link => this.getExistingLicenseType(link);
    });
  }

  getExistingLicenseType(link: string) {
    if (link !== null) {
      if(link.includes("publicdomain/zero/")) {
        this.existinglinkType = 'cc0';
      } else if (link.includes("licenses/by/")) {
        this.existinglinkType = 'cc1';
      } else if (link.includes("licenses/by-sa/")) {
        this.existinglinkType = 'cc2';
      } else if (link.includes("licenses/by-nc/")) {
        this.existinglinkType = 'cc3';
      } else if (link.includes("licenses/by-nd/")) {
        this.existinglinkType = 'cc4';
      } else if (link.includes("licenses/by-nc-sa/")) {
        this.existinglinkType = 'cc5';
      } else if (link.includes("licenses/by-nc-nd/")) {
        this.existinglinkType = 'cc6';
      } else {
        this.existinglinkType = null;
      }
    }
  }

  /**
   * Get the link to the Creative Commons license corresponding with the selected options.
   */
  getCcLicenseLink$(): Observable<string> {

    if (!!this.storedCcLicenseLink) {
      return observableOf(this.storedCcLicenseLink);
    }
    if (!this.getSelectedCcLicense() || this.getSelectedCcLicense().fields.some(
      (field) => !this.getSelectedOption(this.getSelectedCcLicense(), field))) {
      return undefined;
    }
    const selectedCcLicense = this.getSelectedCcLicense();
    return this.submissionCcLicenseUrlDataService.getCcLicenseLink(
      selectedCcLicense,
      new Map(selectedCcLicense.fields.map(
        (field) => [field, this.getSelectedOption(selectedCcLicense, field)]
      )),
    );
  }

  /**
   * Open a given info modal.
   * @param content   the modal content.
   */
  openInfoModal(content) {
    this.modalRef = this.modalService.open(content);
  }

  /**
   * Close the info modal.
   */
  closeInfoModal() {
    this.modalRef.close();
  }

  /**
   * Get section status
   *
   * @return Observable<boolean>
   *     the section status
   */
  getSectionStatus(): Observable<boolean> {
    return observableOf(this.accepted);
  }

  /**
   * Unsubscribe from all subscriptions
   */
  onSectionDestroy(): void {
    this.subscriptions.forEach((subscription) => subscription.unsubscribe());
  }

  /**
   * Initialize the section.
   */
  onSectionInit(): void {
    this.pathCombiner = new JsonPatchOperationPathCombiner('sections', this.sectionData.id);
    this.subscriptions.push(
      this.sectionService.getSectionState(this.submissionId, this.sectionData.id, SectionsType.CcLicense).pipe(
        filter((sectionState) => {
          return isNotEmpty(sectionState) && (isNotEmpty(sectionState.data) || isNotEmpty(sectionState.errorsToShow));
        }),
        distinctUntilChanged(),
        map((sectionState) => sectionState.data as WorkspaceitemSectionCcLicenseObject),
      ).subscribe((data) => {
        if (this.data.accepted !== data.accepted) {
          const path = this.pathCombiner.getPath('uri');
          if (data.accepted) {
            this.getCcLicenseLink$().pipe(
              take(1),
            ).subscribe((link) => {
              this.operationsBuilder.add(path, link.toString(), false, true);
            });
          } else if (!!this.data.uri) {
            this.operationsBuilder.remove(path);
          }
        }
        this.sectionData.data = data;
      }),
      this.submissionCcLicensesDataService.findAll({ elementsPerPage: 9999 }).pipe(
        getFirstSucceededRemoteData(),
        getRemoteDataPayload(),
        map((list) => list.page),
      ).subscribe(
        (licenses) => this.submissionCcLicenses = licenses
      ),
      this.configService.findByPropertyName('cc.license.jurisdiction').pipe(
        getFirstCompletedRemoteData(),
        getRemoteDataPayload()
      ).subscribe((remoteData) => {
          if (remoteData === undefined || remoteData.values.length === 0) {
            // No value configured, use blank value (International jurisdiction)
            this.defaultJurisdiction = '';
          } else {
            this.defaultJurisdiction = remoteData.values[0];
          }
      })
    );
  }

  /**
   * Set the accepted state for the Creative Commons license.
   * @param accepted  the accepted state for the cc license.
   */
  setAccepted(accepted: boolean) {
    this.updateSectionData({
      accepted
    });
    this.updateSectionStatus();
  }

  /**
   * Update the section data for this section.
   */
  updateSectionData(data: WorkspaceitemSectionCcLicenseObject) {
    this.sectionService.updateSectionData(this.submissionId, this.sectionData.id, Object.assign({}, this.data, data));
  }
}
