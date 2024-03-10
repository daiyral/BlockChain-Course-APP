import React from 'react';
import { useForm, useFieldArray } from 'react-hook-form';
import '../styling/RegisterElection.css';

const RegisterElection = (contractInstance) => {
    const {
        handleSubmit,
        register,
        control,
        formState: { errors },
      } = useForm({
        defaultValues: {
          candidates: [{ header: "", slogan: "" }]
        }
      });

    const { fields, append, remove } = useFieldArray({
        control,
        name: "candidates"
    });

    const onSubmit = async (data) => {
        await contractInstance.methods.registerElection(data.electionName, data.adminName).send({from: contractInstance.options.from});
        data.candidates.forEach(async candidate => {
            await contractInstance.methods.addCandidate(candidate.header, candidate.slogan).send({from: contractInstance.options.from});
        });
    };

    return (
        <div className="register-election-container">
            <h1>Register Election</h1>
            <form onSubmit={handleSubmit(onSubmit)}>
            <div className="form-field">
                    <input
                        className="form-input"
                        type="text"
                        placeholder="Election Name"
                        {...register('electionName', { required: true })}
                    />
                    {errors.electionName && <span>This field is required</span>}
                </div>
                <div className='form-field'>
                    <input
                        className="form-input"
                        type="text"
                        placeholder="Admin Name"
                        {...register('adminName', { required: true })}
                    />
                    {errors.adminName && <span>This field is required</span>}
                </div>
                {fields.map((item, index) => (
                    <div className = 'candidate-row' key={item.id}>
                        <input
                            className="form-input"
                            type="text"
                            placeholder="Candidate Header"
                            {...register(`candidates.${index}.header`, { required: true })}
                        />
                        <input
                            className="form-input"
                            type="text"
                            placeholder="Candidate Slogan"
                            {...register(`candidates.${index}.slogan`, { required: true })}
                        />
                        <button type="button" className='add-candidate-button' onClick={() => append({ header: "", slogan: "" })}>Add Candidate</button>
                        <button type="button" className = "remove-candidate-button" onClick={() => remove(index)}>Remove Candidate</button>

                    </div>
                ))}
                <button type="submit" className='register-button'>Register</button>
            </form>
        </div>
    );
}

export default RegisterElection;