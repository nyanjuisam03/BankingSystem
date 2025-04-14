import React ,{useEffect}from 'react'
import { z } from 'zod';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useNavigate } from 'react-router-dom';
import useLoanStore from '../../store/loanStore';
import useUserStore from '../../store/usersStore';
import { useParams } from 'react-router-dom';
import { useSnackbar } from 'notistack';

const loanSchema = z.object({
    loan_type: z.string().nonempty('Loan type is required'),
    amount: z
      .number({ invalid_type_error: 'Amount must be a number' })
      .min(1000, 'Minimum amount is 1000')
      .max(1000000, 'Maximum amount is 1000000'),
    purpose: z.string().nonempty('Purpose is required'),
    term_months: z
      .number({ invalid_type_error: 'Term in months must be a number' })
      .min(1, 'Minimum term is 1 month')
      .max(360, 'Maximum term is 360 months'),
    monthly_income: z
      .number({ invalid_type_error: 'Monthly income must be a number' })
      .min(1000, 'Monthly income must be at least 1000'),
    employment_status: z.enum(['Employed', 'Unemployed', 'Self-Employed'], {
      errorMap: () => ({ message: 'Employment status is required' }),
    }),
    employer_name: z.string().nullable(),
    job_title: z.string().nullable(),
    years_employed: z
      .number({ invalid_type_error: 'Years employed must be a number' })
      .min(0, 'Years employed cannot be negative')
      .nullable(),
    credit_score: z
      .number({ invalid_type_error: 'Credit score must be a number' })
      .min(300, 'Credit score must be at least 300')
      .max(850, 'Credit score must not exceed 850')
      .nullable(),
    existing_loans_monthly_payment: z
      .number({ invalid_type_error: 'Monthly payment must be a number' })
      .min(0, 'Payment cannot be negative')
      .nullable(),
      account_number: z.string().nonempty('Account number is required')
  });

 
function CreateLoanStepTwo({ onBack }) {
    const navigate = useNavigate();
    const createLoan = useLoanStore((state) => state.createLoan);
    const loading = useLoanStore((state) => state.loading);
    const error = useLoanStore((state) => state.error);
    const successMessage = useLoanStore((state) => state.successMessage);
    const user = useUserStore((state) => state.user);
    const { accountNumber } = useParams()
    const { enqueueSnackbar } = useSnackbar();
    
    const {
      register,
      handleSubmit,
      watch,
      setValue,
      formState: { errors },
    } = useForm({
      resolver: zodResolver(loanSchema),
      defaultValues: {
        loan_type: '',
        amount: 1000,
        purpose: '',
        term_months: 12,
        monthly_income: 0,
        employment_status: '',
        employer_name: null,
        job_title: null,
        years_employed: null,
        credit_score: null,
        existing_loans_monthly_payment: 0,
        account_number:accountNumber || ''
      }
    });
  
    useEffect(() => {
      if (accountNumber) {
        setValue('account_number', accountNumber);
      }
    }, [accountNumber, setValue]);
  

    React.useEffect(() => {
      // Check authentication
      if (!user || !user.id) {
        navigate('/login', { state: { from: '/loan-application' } });
      }
    }, [user, navigate]);
  
    const onSubmit = async (data) => {
      try {
         await createLoan(data);
        if (!error) {
          enqueueSnackbar('Loan successfully applied', {
            variant: 'success',
            autoHideDuration: 3000
          });
          navigate('/customer'); // Adjust this to your actual success route
        }
      } catch (err) {
        // Error is handled by the store
        enqueueSnackbar(err.message || 'Failed to apply for loan', {
          variant: 'error',
          autoHideDuration: 4000
        });
        console.error('Loan application failed:', err);
      }
    };
  
    const employmentStatus = watch('employment_status');
  
    if (!user) {
      return (
        <div className="max-w-md mx-auto bg-white rounded-lg shadow p-6">
          <p className="text-center text-gray-600">Please log in to continue...</p>
        </div>
      );
    }
  
  return (
    <div className="max-w-7xl mx-auto bg-white rounded-lg shadow p-6">
    {error && (
      <div className="mb-4 p-3 bg-red-100 text-red-700 rounded">
        {error}
      </div>
    )}
    
    {successMessage && (
      <div className="mb-4 p-3 bg-green-100 text-green-700 rounded">
        {successMessage}
      </div>
    )}

    <h2 className="text-2xl font-bold mb-6">Loan Application</h2>

    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label htmlFor="loan_type" className="block font-medium text-gray-700">
            Loan Type*
          </label>
          <select
            id="loan_type"
            {...register('loan_type')}
            className="w-full border rounded-md p-2"
          >
            <option value="">Select loan type...</option>
            <option value="personal">Personal Loan</option>
            <option value="business">Business Loan</option>
            <option value="mortgage">Mortgage Loan</option>
            <option value="education">Education Loan</option>
          </select>
          {errors.loan_type && (
            <p className="text-red-500 text-sm mt-1">{errors.loan_type.message}</p>
          )}
        </div>

        <div>
        <label htmlFor="accountNumber" className="block font-medium text-gray-700">
          Account Number*
        </label>
        <input
          type="text"
          id="accountNumber"
          {...register('account_number')}
          readOnly
          className="w-full border rounded-md p-2 bg-gray-100 cursor-not-allowed"
        />
        {errors.account_number && (
          <p className="text-red-500 text-sm mt-1">{errors.account_number.message}</p>
        )}
      </div>

      
       </div>


        <div>
          <label htmlFor="purpose" className="block font-medium text-gray-700">
            Purpose*
          </label>
          <textarea
            id="purpose"
            {...register('purpose')}
            className="w-full border rounded-md p-2"
            rows={3}
          />
          {errors.purpose && (
            <p className="text-red-500 text-sm mt-1">{errors.purpose.message}</p>
          )}
        </div>

      <div>


        <div>
          <label htmlFor="term_months" className="block font-medium text-gray-700">
            Term (Months)*
          </label>
          <input
            type="number"
            id="term_months"
            {...register('term_months', { valueAsNumber: true })}
            className="w-full border rounded-md p-2"
          />
          {errors.term_months && (
            <p className="text-red-500 text-sm mt-1">{errors.term_months.message}</p>
          )}
        </div>

        <div>
          <label htmlFor="monthly_income" className="block font-medium text-gray-700">
            Monthly Income*
          </label>
          <input
            type="number"
            id="monthly_income"
            {...register('monthly_income', { valueAsNumber: true })}
            className="w-full border rounded-md p-2"
          />
          {errors.monthly_income && (
            <p className="text-red-500 text-sm mt-1">{errors.monthly_income.message}</p>
          )}
        </div>

        <div>
          <label htmlFor="employment_status" className="block font-medium text-gray-700">
            Employment Status*
          </label>
          <select
            id="employment_status"
            {...register('employment_status')}
            className="w-full border rounded-md p-2"
          >
            <option value="">Select status...</option>
            <option value="Employed">Employed</option>
            <option value="Self-Employed">Self-Employed</option>
            <option value="Unemployed">Unemployed</option>
          </select>
          {errors.employment_status && (
            <p className="text-red-500 text-sm mt-1">{errors.employment_status.message}</p>
          )}
        </div>

        {(employmentStatus === 'Employed' || employmentStatus === 'Self-Employed') && (
          <>
            <div>
              <label htmlFor="employer_name" className="block font-medium text-gray-700">
                Employer Name
              </label>
              <input
                type="text"
                id="employer_name"
                {...register('employer_name')}
                className="w-full border rounded-md p-2"
              />
            </div>

            <div>
              <label htmlFor="job_title" className="block font-medium text-gray-700">
                Job Title
              </label>
              <input
                type="text"
                id="job_title"
                {...register('job_title')}
                className="w-full border rounded-md p-2"
              />
            </div>

            <div>
              <label htmlFor="years_employed" className="block font-medium text-gray-700">
                Years Employed
              </label>
              <input
                type="number"
                id="years_employed"
                {...register('years_employed', { valueAsNumber: true })}
                className="w-full border rounded-md p-2"
              />
            </div>
          </>
        )}

        <div>
          <label htmlFor="existing_loans_monthly_payment" className="block font-medium text-gray-700">
            Existing Loan Payments (Monthly)
          </label>
          <input
            type="number"
            id="existing_loans_monthly_payment"
            {...register('existing_loans_monthly_payment', { valueAsNumber: true })}
            className="w-full border rounded-md p-2"
          />
        </div>

      </div>

      <div className="flex space-x-4">
  <button
    type="button"
    onClick={onBack}
    className="w-1/2 border border-red-800 text-red-800 bg-white px-4 py-2 rounded hover:bg-red-800 hover:text-white"
  >
    Back
  </button>
  <button
    type="submit"
    className="w-1/2 border border-gray-800 text-gray-800 bg-white px-4 py-2 rounded hover:bg-gray-800 hover:text-white disabled:bg-gray-400"
    disabled={loading}
  >
    {loading ? 'Processing...' : 'Create Account'}
  </button>
</div>
    </form>
  </div>
  )
}

export default CreateLoanStepTwo
