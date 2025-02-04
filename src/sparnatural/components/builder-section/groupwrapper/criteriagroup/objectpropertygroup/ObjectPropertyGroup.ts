import tippy from "tippy.js";
import ObjectPropertyTypeId from "./ObjectPropertyTypeId";
import ISpecProvider from "../../../../../spec-providers/ISpecProviders";
import CriteriaGroup from "../CriteriaGroup";
import HTMLComponent from "../../../../HtmlComponent";
import { SelectedVal } from "../../../../../generators/ISparJson";

/**
 * The property selection part of a criteria/line, encapsulating an ObjectPropertyTypeId
 **/
class ObjectPropertyGroup extends HTMLComponent {
  inputTypeComponent: ObjectPropertyTypeId;
  objectPropVal: SelectedVal = {
    variable: null,
    type: null,
  }; // value which shows which object property got chosen by the config for subject and object
  ParentCriteriaGroup: CriteriaGroup;
  specProvider: ISpecProvider;
  startClassVal: SelectedVal;
  endClassVal: SelectedVal;
  temporaryLabel: string;
  constructor(
    ParentComponent: CriteriaGroup,
    specProvider: ISpecProvider,
    temporaryLabel: string
  ) {
    super("ObjectPropertyGroup", ParentComponent, null);
    this.ParentCriteriaGroup = ParentComponent;
    this.temporaryLabel = temporaryLabel;
    this.specProvider = specProvider;
  }

  render() {
    super.render();
    this.#addEventListener();
    return this;
  }
  /*
		renders the temporarly object property
	*/
  onStartClassGroupSelected(startClassVal: SelectedVal) {
    this.startClassVal = startClassVal;
    //this will set the temporary label since there hasn't been a Value chosen for EndClassGroup
    this.inputTypeComponent = new ObjectPropertyTypeId(
      this,
      this.specProvider,
      this.temporaryLabel,
      this.startClassVal
    ).render();
  }

  #addEventListener() {
    // event is caught here and then bubbles up to the CriteriaGroup
    this.html[0].addEventListener(
      "onObjectPropertyTypeIdSelected",
      (e: CustomEvent) => {
        e.stopImmediatePropagation();
        if (e.detail === "" || !e.detail)
          throw Error('No value received on "onObjectPropertyGroupSelected"');
        this.#createSparqlVar(e.detail);
        this.#valueWasSelected();
      }
    );
  }

  #createSparqlVar(type: string) {
    this.objectPropVal.type = type;
    this.html[0].dispatchEvent(
      new CustomEvent("getSparqlVarId", {
        bubbles: true,
        detail: (id: number) => {
          //callback
          this.objectPropVal.variable = `?${this.specProvider
            .getLabel(type)
            .replace(/\s+/g, "")}_${id}`;
        },
      })
    );
  }
  #valueWasSelected() {
    this.html[0].dispatchEvent(
      new CustomEvent("onObjectPropertyGroupSelected", {
        bubbles: true,
        detail: this.objectPropVal,
      })
    );
    var desc = this.specProvider.getTooltip(this.objectPropVal.type);

    if (desc) {
      $(this.ParentCriteriaGroup.StartClassGroup.html)
        .find(".ClassTypeId")
        .attr("data-tippy-content", desc);
      // tippy('.EndClassGroup .ClassTypeId[data-tippy-content]', settings.tooltipConfig);
      var tippySettings = Object.assign({}, this.settings.tooltipConfig);
      tippySettings.placement = "top-start";
      tippy(".StartClassGroup .ClassTypeId[data-tippy-content]", tippySettings);
    } else {
      $(this.ParentCriteriaGroup.StartClassGroup.html).removeAttr(
        "data-tippy-content"
      );
    }
  }

  getTypeSelected() {
    return this.objectPropVal.type;
  }

  getVarName() {
    return this.objectPropVal.variable;
  }

  /*
		This method is triggered when an Object is selected.
		For example: Museum isRelatedTo Country. As soon as Country is chosen this method gets called
	*/
  onEndClassGroupSelected(endClassVal: SelectedVal) {
    // this will update the temporarly label
    this.inputTypeComponent.setEndClassVal(endClassVal);
    this.inputTypeComponent.render();
  }
}
export default ObjectPropertyGroup;
