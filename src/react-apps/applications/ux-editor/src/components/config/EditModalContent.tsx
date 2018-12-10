import { createStyles, Grid, Typography, withStyles } from '@material-ui/core';
import * as React from 'react';
import { connect } from 'react-redux';
import Select from 'react-select';
import { SelectDataModelComponent } from './SelectDataModelComponent';

const styles = createStyles({
  inputHelper: {
    marginTop: '1em',
    fontSize: '1.6rem',
    lineHeight: '3.2rem',
  },
});
const customInput = {
  control: (base: any) => ({
    ...base,
    borderRadius: '0 !important',
  }),
  option: (provided: any) => ({
    ...provided,
    whiteSpace: 'pre-wrap',
  }),
};

export interface IEditModalContentProps {
  component: FormComponentType;
  dataModel?: IDataModelFieldElement[];
  textResources?: ITextResource[];
  saveEdit?: (updatedComponent: FormComponentType) => void;
  cancelEdit?: () => void;
  language: any;
  classes: any;
}

export interface IEditModalContentState {
  component: IFormComponent;
}

class EditModalContentComponent extends React.Component<IEditModalContentProps, IEditModalContentState> {
  constructor(_props: IEditModalContentProps, _state: IEditModalContentState) {
    super(_props, _state);

    this.state = {
      component: _props.component,
    };
  }

  public handleDisabledChange = (e: any): void => {
    this.setState({
      component: {
        ...this.state.component,
        disabled: e.target.checked,
      },
    });
  }

  public handleRequiredChange = (e: any): void => {
    this.setState({
      component: {
        ...this.state.component,
        required: e.target.checked,
      },
    });
  }

  public handleTitleChange = (e: any): void => {
    this.setState({
      component: {
        ...this.state.component,
        title: e.target.value,
      },
    });
  }

  public handleDataModelChange = (e: any) => {
    const dataModelBinding = e.target.value;
    const title = this.getTextKeyFromDataModel(dataModelBinding);
    if (title) {
      this.setState({
        component: {
          ...this.state.component,
          dataModelBinding,
          title,
        },
      });
    } else {
      this.setState({
        component: {
          ...this.state.component,
          dataModelBinding,
        },
      });
    }
  }

  public handleAddOption = () => {
    const updatedComponent: IFormComponent = this.state.component;
    updatedComponent.options.push({
      label: this.props.language.general.label,
      value: this.props.language.general.value,
    });
    this.setState({
      component: updatedComponent,
    });
  }

  public handleRemoveOption = (index: number) => {
    const updatedComponent: IFormComponent = this.state.component;
    updatedComponent.options.splice(index, 1);
    this.setState({
      component: updatedComponent,
    });
  }

  public handleUpdateOptionLabel = (index: number, event: any) => {
    const updatedComponent: IFormComponent = this.state.component;
    updatedComponent.options[index].label = event.target.value;
    this.setState({
      component: updatedComponent,
    });
  }

  public handleUpdateOptionValue = (index: number, event: any) => {
    const updatedComponent: IFormComponent = this.state.component;
    updatedComponent.options[index].value = event.target.value;
    this.setState({
      component: updatedComponent,
    });
  }

  public handleUpdateHeaderSize = (event: any) => {
    const updatedComponent: IFormHeaderComponent = this.state.component as IFormHeaderComponent;
    updatedComponent.size = event.value;
    this.setState({
      component: updatedComponent,
    });
  }

  public getTextKeyFromDataModel = (dataBindingName: string): string => {
    const element: IDataModelFieldElement = this.props.dataModel.find((elem) =>
      elem.DataBindingName === dataBindingName);
    return element.Texts.Label;
  }

  public getTextResourceKeys = (): any[] => {
    if (!this.props.textResources) {
      return [];
    }

    return (this.props.textResources.map((resource) => {
      return resource.id;
    }));
  }

  public renderComponentSpecificContent(): JSX.Element {
    switch (this.props.component.component) {
      case 'Header': {
        const sizes = [
          { value: 'S', label: this.props.language.ux_editor.modal_header_type_h3 },
          { value: 'M', label: this.props.language.ux_editor.modal_header_type_h2 },
          { value: 'L', label: this.props.language.ux_editor.modal_header_type_h1 },
        ];
        return (
          <Grid item={true} xs={6} container={true} direction={'column'} spacing={0}>
            <Typography gutterBottom={false} className={this.props.classes.inputHelper}>
              {this.props.language.ux_editor.modal_header_type_helper}
            </Typography>
            <Select
              styles={customInput}
              defaultValue={this.state.component.size ?
                  sizes.find((size) => size.value === this.state.component.size ) :
                  sizes[0]}
              onChange={this.handleUpdateHeaderSize}
              options={sizes}
            />
          </Grid>
        );
      }
      case 'Input': {
        const component: IFormInputComponent = this.state.component as IFormInputComponent;
        return (
          <div className='form-group a-form-group mt-2'>
            <div className='custom-control custom-control-stacked pl-0 custom-checkbox a-custom-checkbox'>
              <input
                type={'checkbox'}
                value={component.disabled ? 'true' : 'false'}
                onChange={this.handleDisabledChange}
                className='custom-control-input'
                checked={component.disabled ? true : false}
                name={'InputIsDisabled'}
                id={'InputIsDisabled'}
              />
              <label className='pl-3 custom-control-label a-fontBold' htmlFor='InputIsDisabled'>
                {this.props.language.general.disabled}
              </label>
            </div>
            <div className='custom-control custom-control-stacked pl-0 custom-checkbox a-custom-checkbox'>
              <input
                type={'checkbox'}
                value={component.required ? 'true' : 'false'}
                onChange={this.handleRequiredChange}
                className='custom-control-input'
                checked={component.required ? true : false}
                name={'InputIsRequired'}
                id={'InputIsRequired'}
              />
              <label className='pl-3 custom-control-label a-fontBold' htmlFor='InputIsRequired'>
                {this.props.language.general.required}
              </label>
            </div>
          </div>
        );
      }
      case 'RadioButtons': {
        const component: IFormRadioButtonComponent = this.state.component as IFormRadioButtonComponent;
        return (
          <div className='form-group a-form-group mt-2'>
            <h2 className='a-h4'>
              {this.props.language.ux_editor.modal_options}
            </h2>
            <div className='row align-items-center'>
              <div className='col-5'>
                <label className='a-form-label'>
                  {this.props.language.general.label}
                </label>
              </div>
              <div className='col-5'>
                <label className='a-form-label'>
                  {this.props.language.general.value}
                </label>
              </div>
            </div>
            {component.options.map((option, index) => (
              <div key={index} className='row align-items-center'>
                <div className='col-5'>
                  <label htmlFor={'editModal_radiolabel-' + index} className='a-form-label sr-only'>
                    {this.props.language.ux_editor.modal_text}
                  </label>
                  <select
                    id={'editModal_radiolabel-' + index}
                    className='custom-select a-custom-select'
                    onChange={this.handleUpdateOptionLabel.bind(this, index)}
                    value={option.label}
                  >}
                    <option key={'empty'} value={''}>
                      {this.props.language.general.choose_label}
                    </option>
                    {this.renderTextResourceOptions()}
                  </select>
                </div>
                <div className='col-5'>
                  <input
                    onChange={this.handleUpdateOptionValue.bind(this, index)}
                    value={option.value}
                    className='form-control'
                    type='text'
                  />
                </div>
                <div className='col-2'>
                  <button
                    type='button'
                    className='a-btn a-btn-icon'
                    onClick={this.handleRemoveOption.bind(this, index)}
                  >
                    <i className='ai ai-circle-exit a-danger ai-left' />
                  </button>
                </div>
              </div>
            ))}
            <div className='row align-items-center mb-1'>
              <div className='col-4 col'>
                <button type='button' className='a-btn' onClick={this.handleAddOption}>
                  {this.props.language.ux_editor.modal_new_option}
                </button>
              </div>
              <div />
            </div>
          </div>
        );
      }
      case 'Dropdown': {
        const component: IFormDropdownComponent = this.state.component as IFormDropdownComponent;
        return (
          <div className='form-group a-form-group mt-2'>
            <h2 className='a-h4'>
              {this.props.language.ux_editor.modal_options}
            </h2>
            <div className='row align-items-center'>
              <div className='col-5'>
                <label className='a-form-label'>
                  {this.props.language.general.label}
                </label>
              </div>
              <div className='col-5'>
                <label className='a-form-label'>
                  {this.props.language.general.value}
                </label>
              </div>
            </div>

            {component.options.map((option, index) => (
              <div key={index} className='row align-items-center'>
                <div className='col-5'>
                  <label htmlFor={'editModal_dropdownlabel-' + index} className='a-form-label sr-only'>
                    {this.props.language.ux_editor.modal_text}
                  </label>
                  <select
                    id={'editModal_dropdownlabel-' + index}
                    className='custom-select a-custom-select'
                    onChange={this.handleUpdateOptionLabel.bind(this, index)}
                    value={option.label}
                  >}
                    <option key={'empty'} value={''}>
                      {this.props.language.general.choose_label}
                    </option>
                    {this.renderTextResourceOptions()}
                  </select>
                </div>

                <div className='col-5'>
                  <input
                    onChange={this.handleUpdateOptionValue.bind(this, index)}
                    value={option.value}
                    className='form-control'
                    type='text'
                  />
                </div>

                <div className='col-2'>
                  <button
                    type='button'
                    className='a-btn a-btn-icon'
                    onClick={this.handleRemoveOption.bind(this, index)}
                  >
                    <i className='ai ai-circle-exit a-danger ai-left' />
                  </button>
                </div>
              </div>
            ))}

            <div className='row align-items-center mb-1'>
              <div className='col-4 col'>
                <button type='button' className='a-btn' onClick={this.handleAddOption}>
                  {this.props.language.ux_editor.modal_new_option}
                </button>
              </div>
              <div />
            </div>
          </div>
        );
      }

      case 'Submit': {
        return (
          <div className='form-group a-form-group'>
            <label className='a-form-label'>
              {this.props.language.ux_editor.modal_text_key}
            </label>
            <input
              type='text'
              disabled={true}
              value={this.props.component.textResourceId}
              className='form-control'
            />
          </div>
        );
      }

      default: {
        return null;
      }
    }
  }

  public renderSelectDataBinding = (componentType: string): JSX.Element => {
    return (this.shouldComponentDataBind(componentType) ?
      (
        <SelectDataModelComponent
          onDataModelChange={this.handleDataModelChange}
          selectedElement={this.state.component.dataModelBinding}
          language={this.props.language}
        />) : null);
  }

  public renderTextResourceOptions = (): JSX.Element[] => {
    if (!this.props.textResources) {
      return null;
    }

    return (
      this.props.textResources.map((resource, index) => {
        const option = this.truncate(resource.value);
        return (
          <option key={index} value={resource.id} title={resource.value}>
            {option}
          </option>
        );
      }));
  }

  public truncate = (s: string) => {
    if (s.length > 60) {
      return s.substring(0, 60);
    } else {
      return s;
    }
  }

  public render(): JSX.Element {
    return (
      <>
      {this.renderComponentSpecificContent()}
      </>
    );
  }

  private shouldComponentDataBind = (componentType: string): boolean => {
    switch (componentType) {
      case ('Input'):
      case ('Checkboxes'):
      case ('TextArea'):
      case ('RadioButtons'):
      case ('ThirdParty'):
      case ('Dropdown'): {
        return true;
      }

      default: {
        return false;
      }
    }
  }
}

const mapStateToProps = (
  state: IAppState,
  props: IEditModalContentProps,
): IEditModalContentProps => {
  return {
    language: state.appData.language.language,
    classes: props.classes,
    ...props,
  };
};

export const EditModalContent = withStyles(styles, { withTheme: true })
  (connect(mapStateToProps)(EditModalContentComponent));