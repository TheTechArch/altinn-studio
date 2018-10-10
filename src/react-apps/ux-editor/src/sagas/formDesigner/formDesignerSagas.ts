import { SagaIterator } from 'redux-saga';
import { call, select, takeLatest } from 'redux-saga/effects';
import * as FormDesignerActions from '../../actions/formDesignerActions/actions';
import FormDesignerActionDispatchers from '../../actions/formDesignerActions/formDesignerActionDispatcher';
import * as FormDesignerActionTypes from '../../actions/formDesignerActions/formDesignerActionTypes';
import { IFormDesignerState } from '../../reducers/formDesignerReducer';
import { IFormFillerState } from '../../reducers/formFillerReducer';
import { get, post } from '../../utils/networking';
// tslint:disable-next-line:no-var-requires
const uuid = require('uuid/v4');
const selectFormDesigner = (state: IAppState): IFormDesignerState => state.formDesigner;
const selectFormFiller = (state: IAppState): IFormFillerState => state.formFiller;

function* addFormComponentSaga({
  component,
  containerId,
  callback,
}: FormDesignerActions.IAddFormComponentAction): SagaIterator {
  try {
    const id: string = uuid();
    const formDesignerState: IFormDesignerState = yield select(selectFormDesigner);

    if (!containerId) {
      if (formDesignerState.layout.containers && Object.keys(formDesignerState.layout.containers).length > 0) {
        containerId = Object.keys(formDesignerState.layout.order)[0];
      } else {
        containerId = uuid();
        const container = { repeating: false, dataModelGroup: null } as ICreateFormContainer;
        yield call(FormDesignerActionDispatchers.addFormContainerFulfilled, container, containerId);
      }
    }

    yield call(
      FormDesignerActionDispatchers.addFormComponentFulfilled,
      component,
      id,
      containerId,
      callback,
    );
  } catch (err) {
    yield call(FormDesignerActionDispatchers.addFormComponentRejected, err);
  }
}

export function* watchAddFormComponentSaga(): SagaIterator {
  yield takeLatest(
    FormDesignerActionTypes.ADD_FORM_COMPONENT,
    addFormComponentSaga,
  );
}

function* addFormContainerSaga({
  container,
  positionAfterId,
}: FormDesignerActions.IAddFormContainerAction): SagaIterator {
  try {
    const id = uuid();
    const formDesignerState: IFormDesignerState = yield select(selectFormDesigner);
    let baseContainerId;
    if (Object.keys(formDesignerState.layout.order)
      && Object.keys(formDesignerState.layout.order).length > 0) {
      baseContainerId = Object.keys(formDesignerState.layout.order)[0];
    }
    yield call(FormDesignerActionDispatchers.addFormContainerFulfilled, container, id, positionAfterId, baseContainerId);
  } catch (err) {
    yield call(FormDesignerActionDispatchers.addFormContainerRejected, err);
  }
}

export function* watchAddFormContainerSaga(): SagaIterator {
  yield takeLatest(
    FormDesignerActionTypes.ADD_FORM_CONTAINER,
    addFormContainerSaga,
  );
}

function* deleteFormComponentSaga({
  id
}: FormDesignerActions.IDeleteComponentAction): SagaIterator {
  try {
    const formDesignerState: IFormDesignerState = yield select(selectFormDesigner);
    let containerId = Object.keys(formDesignerState.layout.order)[0];
    Object.keys(formDesignerState.layout.order).forEach((cId, index) => {
      if (formDesignerState.layout.order[cId].find(componentId => componentId === id)) {
        containerId = cId;
      }
    })
    yield call(FormDesignerActionDispatchers.deleteFormComponentFulfilled, id, containerId);
  } catch (err) {
    yield call(FormDesignerActionDispatchers.deleteFormComponentRejected, err);
  }
}

export function* watchDeleteFormComponentSaga(): SagaIterator {
  yield takeLatest(
    FormDesignerActionTypes.DELETE_FORM_COMPONENT,
    deleteFormComponentSaga,
  );
}

function* deleteFormContainerSaga({
  id,
}: FormDesignerActions.IDeleteContainerAction): SagaIterator {
  try {
    const formDesignerState: IFormDesignerState = yield select(selectFormDesigner);
    // First delete all components inside container
    for (const componentId of formDesignerState.layout.order[id]) {
      yield call(FormDesignerActionDispatchers.deleteFormComponentFulfilled, componentId, id);
    }

    // Then delete container iteself
    yield call(FormDesignerActionDispatchers.deleteFormContainerFulfilled, id);
  } catch (err) {
    yield call(FormDesignerActionDispatchers.deleteFormContainerRejected, err);
  }
}

export function* watchDeleteFormContainerSaga(): SagaIterator {
  yield takeLatest(
    FormDesignerActionTypes.DELETE_FORM_CONTAINER,
    deleteFormContainerSaga,
  );
}

function* fetchFormLayoutSaga({
  url
}: FormDesignerActions.IFetchFormLayoutAction): SagaIterator {
  try {
    const formLayout = yield call(get, url);
    yield call(
      FormDesignerActionDispatchers.fetchFormLayoutFulfilled,
      formLayout.data,
    );
  } catch (err) {
    yield call(FormDesignerActionDispatchers.fetchFormLayoutRejected, err);
  }
}

export function* watchFetchFormLayoutSaga(): SagaIterator {
  yield takeLatest(
    FormDesignerActionTypes.FETCH_FORM_LAYOUT,
    fetchFormLayoutSaga,
  );
}

function* generateRepeatingGroupsSaga({ }: FormDesignerActions.IGenerateRepeatingGroupsAction): SagaIterator {
  try {
    const formDesignerState: IFormDesignerState = yield select(selectFormDesigner);
    const formFillerState: IFormFillerState = yield select(selectFormFiller);
    const containers = formDesignerState.layout.containers;
    if (Object.keys(containers).length === 0) return;

    const baseContainerId = Object.keys(formDesignerState.layout.order)[0];
    for (const containerId of Object.keys(containers)) {
      const container = containers[containerId];
      if (!container.repeating) return;

      const repeatingData = Object.keys(formFillerState.formData).filter((formDataKey) => {
        return formDataKey.includes(container.dataModelGroup + '[');
      });

      if (repeatingData.length === 0) return;

      let maxIndex = 0;
      repeatingData.forEach((data) => {
        const index = parseInt(data.substring(data.indexOf('[') + 1, data.indexOf(']')), 10);
        if (index <= maxIndex) return;
        maxIndex = index;
      });

      let renderAfterId = containerId;
      for (let i = 1; i <= maxIndex; i++) {
        const newId = uuid();
        const newContainer: ICreateFormContainer = {
          repeating: container.repeating,
          dataModelGroup: container.dataModelGroup,
          index: i,
        };

        yield call(FormDesignerActionDispatchers.addFormContainerFulfilled, newContainer, newId, renderAfterId, baseContainerId);
        renderAfterId = newId;
      }
    }
  } catch (err) {
    yield call(FormDesignerActionDispatchers.generateRepeatingGroupsActionRejected, err);
  }
}

export function* watchGenerateRepeatingGroupsSaga(): SagaIterator {
  yield takeLatest(
    FormDesignerActionTypes.GENERATE_REPEATING_GROUPS,
    generateRepeatingGroupsSaga,
  );
}

function* saveFormLayoutSaga({
  url
}: FormDesignerActions.ISaveFormLayoutAction): SagaIterator {
  try {
    const formLayout: IAppState = yield select();
    yield call(post, url, {
      data: {
        components: formLayout.formDesigner.layout.components,
        containers: formLayout.formDesigner.layout.containers,
        order: formLayout.formDesigner.layout.order,
      }
    });
    yield call(FormDesignerActionDispatchers.saveFormLayoutFulfilled);
  } catch (err) {
    yield call(FormDesignerActionDispatchers.saveFormLayoutRejected, err);
  }
}

export function* watchSaveFormLayoutSaga(): SagaIterator {
  yield takeLatest(
    FormDesignerActionTypes.SAVE_FORM_LAYOUT,
    saveFormLayoutSaga
  );
}

function* updateDataModelBindingSaga({
  dataModelBinding,
  id
}: FormDesignerActions.IUpdateDataModelBindingAction): SagaIterator {
  try {
    yield call(
      FormDesignerActionDispatchers.updateDataModelBindingFulfilled,
      dataModelBinding,
      id
    );
  } catch (err) {
    yield call(
      FormDesignerActionDispatchers.updateDataModelBindingRejected,
      err
    );
  }
}

export function* watchUpdateDataModelBindingSaga(): SagaIterator {
  yield takeLatest(
    FormDesignerActionTypes.UPDATE_DATA_MODEL_BINDING,
    updateDataModelBindingSaga
  );
}

function* updateFormComponentSaga({
  updatedComponent,
  id
}: FormDesignerActions.IUpdateFormComponentAction): SagaIterator {
  try {
    yield call(
      FormDesignerActionDispatchers.updateFormComponentFulfilled,
      updatedComponent,
      id
    );
  } catch (err) {
    yield call(FormDesignerActionDispatchers.updateFormComponentRejected, err);
  }
}

export function* watchUpdateFormComponentSaga(): SagaIterator {
  yield takeLatest(
    FormDesignerActionTypes.UPDATE_FORM_COMPONENT,
    updateFormComponentSaga
  );
}