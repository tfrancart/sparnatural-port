import ISpecProvider from "../../../spec-providers/ISpecProviders";
import { getSettings } from "../../../../configs/client-configs/settings";
import HTMLComponent from "../../HtmlComponent";
import EditComponents from "../../builder-section/groupwrapper/criteriagroup/edit-components/EditComponents";
import { Config } from "../../../../configs/fixed-configs/SparnaturalConfig";

/*
    The parent component here is in the beginning the ActionsGroup component. That seems very useless. 
    check if there are any things going on eith ActionWhere.ParenComponent except the rendering in render()
    There the Endclassgroup is foun
*/
class ActionWhere extends HTMLComponent {
  parentComponent: EditComponents;
  specProvider: ISpecProvider;
  callBack: () => void;
  btn: JQuery<HTMLElement>;
  constructor(
    parentComponent: EditComponents,
    specProvider: ISpecProvider,
    callBack: () => void
  ) {
    //TODO refactor the null init in html widget
    super("ActionWhere", parentComponent, null);
    this.specProvider = specProvider;
    this.callBack = callBack;
    this.parentComponent = parentComponent;
  }
  render = () => {
    super.render();
    var choiceNumber = 2;
    // TODO : if we ever want to remove the Any option for NON_SELECTABLE_PROPERTY, then uncomment this code
    // see https://github.com/sparna-git/Sparnatural/issues/338
    /*
    if (
      this.parentComponent.widgetWrapper.getWidgetType() ==
      Config.NON_SELECTABLE_PROPERTY
    ) {
      choiceNumber = 1;
    }
    */
    var endLabel = this.specProvider.getLabel(
      this.parentComponent.endClassVal.type
    );
    

    this.parentComponent.html[0].classList.add("nb-choice-2");

    let editTrait = $(`
    <span class="edit-trait">
      <span class="edit-num"> ${choiceNumber}</span>
    </span>`);
    let where = $(`
      <div> ${getSettings().langSearch.Search} ${endLabel} ${
      getSettings().langSearch.That
    } </div>
    `);
    this.btn = $(`<a><i class="fa-solid fa-plus"></i></a>`);
    where = where.add(this.btn[0]);
    editTrait = editTrait.add(where);
    this.btn[0].addEventListener("click", () => {
      this.callBack();
    });
    this.html.append(editTrait);
    return this;
  };
}
export default ActionWhere;
