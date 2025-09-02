import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface DashboardInitialState {
    isLoading: boolean;
    isError: boolean;
    errorMessage: string;
    clinicData: any;
    bankData: any;
    availabilityData: any;
    subscriptionData: any;
    agreementData: any;
    todayAppointments: any;
}

const initialState: DashboardInitialState = {
    isLoading: false,
    isError: false,
    errorMessage: '',
    clinicData: {},
    bankData: {},
    availabilityData: [],
    subscriptionData: {},
    agreementData: {},
    todayAppointments: [],
};

export const dashboardSlice = createSlice({
    name: 'dashboard',
    initialState,
    reducers: {
        setClinicData: (state, action: PayloadAction<any>) => {
            state.clinicData = { ...action.payload }
        },
        setBankData: (state, action: PayloadAction<any>) => {
            state.bankData = { ...action.payload }
        },
        setAvailabilityData: (state, action: PayloadAction<any>) => {
            state.availabilityData = [ ...action.payload ]
        },
        setSubscriptionData: (state, action: PayloadAction<any>) => {
            state.subscriptionData = { ...action.payload }
        },
        setAgreementData: (state, action: PayloadAction<any>) => {
            state.agreementData = { ...action.payload }
        },
        setTodayAppointments: (state, action: PayloadAction<any>) => {
            state.todayAppointments = [ ...action.payload ]
        }
    },
});

const dashboardReducer = dashboardSlice.reducer;

export const { setClinicData, setBankData, setAvailabilityData, setSubscriptionData, setAgreementData, setTodayAppointments } = dashboardSlice.actions;
export default dashboardReducer;
