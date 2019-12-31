import React, { useState, useEffect } from 'react';

const EditTextInput = ({
  labelText,
  fieldName,
  value,
  validator,
  required = false,
  inputChanged,
  exampleText = '',
  type = 'text',
  textarea = false,
  validityChanged,
  onFocus,
  onBlur
}) => {
  const [input, setInput] = useState(null);
  const [loaded, setLoaded] = useState(false);
  const [error, setError] = useState('');
  const [inFocus, setInFocus] = useState(false);

  /**
   * Sets a `loaded` state once the text field has been prepopulated.
   * NB:- This assumes the parent component will always pass down strings, including
   * an empty string in place of absent data.
   */
  useEffect(() => {
    if (!loaded && typeof value === 'string') {
      setLoaded(true);
    }
  }, [value]);

  /**
   * The following effect runs initial validation checks for each prepopulated input.
   * This generally isn't necessary since profile data fetched from mongoDB should
   * already respect validation, but is included here in case any validators are later
   * changed, which could cause some stale profile data in the db to become invalid.
   */
  // useEffect(() => {
  //   if (loaded && validator) {
  //     if (validator.async) {
  //       validator
  //         .validate(value)
  //         .then(setError)
  //         .catch(e => setError(''));
  //     } else {
  //       setError(validator.validate(value));
  //     }
  //   }
  // }, [loaded]);

  const handleInputChange = async e => {
    // update component input state
    // run validation
    // emit change and error status to parent
    const inputName = e.target.name;
    const inputVal = e.target.value;
    setInput(inputVal);

    // if running an async validator, emit a partial update here for performance reasons (note inputChanged is missing its third argument that would signal validity. By sending the validator's result later, we don't have to await an asynchronous task to emit the input change)
    if (validator && !validator.onBlur && validator.async) {
      inputChanged(inputName, inputVal);
    }

    let isValid = true;
    let error = '';

    if (validator && !validator.onBlur) {
      if (validator.async) {
        // asynchronous validation
        try {
          error = await validator.validate(inputVal);
        } catch (e) {
          error = '';
        }
      } else {
        error = validator.validate(inputVal);
      }
    }

    if (error) {
      setError(error);
      isValid = false;
    } else {
      setError('');
    }
    if (validator && !validator.onBlur && validator.async) {
      validityChanged(inputName, isValid);
    } else {
      inputChanged(inputName, inputVal, isValid);
    }
  };

  const handleFocus = e => {
    setInFocus(true);
    if (onFocus) onFocus();
  };

  const handleBlur = async e => {
    e.persist();
    setInFocus(false);
    if (onBlur) onBlur();
    runBlurValidator(e);
  };

  const runBlurValidator = async e => {
    if (!validator || !validator.onBlur) return;
    const inputName = e.target.name;
    const inputVal = e.target.value;

    let error = '';

    if (validator.async) {
      // partial update for performance, as above
      // inputChanged(inputName, inputVal);
      error = await validator.validate(inputVal);
    } else {
      error = validator.validate(inputVal);
    }
    const isValid = error ? false : true;
    setError(error);
    validityChanged(inputName, isValid);
    // if (validator.async) {
    //   validityChanged(inputName, isValid);
    // } else {
    //   inputChanged(inputName, inputVal, isValid);
    // }
  };

  return (
    <div className="form-control--edit__field">
      <label htmlFor={fieldName}>
        {labelText}{' '}
        {required && (
          <span className={`red-star${error ? ' red-star--active' : ''}`}>
            *
          </span>
        )}
        {exampleText && <span className="example">{exampleText}</span>}
      </label>
      {!textarea ? (
        <input
          type="text"
          name={fieldName}
          id={fieldName}
          className={`form-control${error ? ' form-control--error' : ''}`}
          type={type}
          defaultValue={value}
          onKeyUp={handleInputChange}
          onFocus={handleFocus}
          onBlur={handleBlur}
        />
      ) : (
        <textarea
          type="text"
          name={fieldName}
          id={fieldName}
          className={`form-control${error ? ' form-control--error' : ''}`}
          type={type}
          defaultValue={value}
          onKeyUp={handleInputChange}
          onFocus={handleFocus}
          onBlur={handleBlur}
          cols="40"
          rows="10"
          resize="vertical"
        ></textarea>
      )}
      <div className="form-control__errors">
        <ul>{error && <li>{error}</li>}</ul>
      </div>
    </div>
  );
};

export default EditTextInput;
