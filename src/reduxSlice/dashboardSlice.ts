import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface DashboardInitialState {
    isAuthenticated: boolean;
    isLoading: boolean;
    isError: boolean;
    errorMessage: string;
    userData: any;
    clinicData: any;
    bankData: any;
    availabilityData: any;
    subscriptionData: any;
    agreementData: any;
}

const initialState: DashboardInitialState = {
    isAuthenticated: false,
    isLoading: false,
    isError: false,
    errorMessage: '',
    userData: {},
    clinicData: {},
    bankData: {},
    availabilityData: {},
    subscriptionData: {},
    agreementData: {},
};

export const dashboardSlice = createSlice({
    name: 'dashboard',
    initialState,
    reducers: {
        setUserData: (state, action: PayloadAction<any>) => {
            state.userData = { ...action.payload }
        },
        setClinicData: (state, action: PayloadAction<any>) => {
            state.clinicData = { ...action.payload }
        },
        setBankData: (state, action: PayloadAction<any>) => {
            state.bankData = { ...action.payload }
        },
        setAvailabilityData: (state, action: PayloadAction<any>) => {
            state.availabilityData = { ...action.payload }
        },
        setSubscriptionData: (state, action: PayloadAction<any>) => {
            state.subscriptionData = { ...action.payload }
        },
        setAgreementData: (state, action: PayloadAction<any>) => {
            state.agreementData = { ...action.payload }
        }
    },
});

const dashboardReducer = dashboardSlice.reducer;

export const { setUserData, setClinicData, setBankData, setAvailabilityData, setSubscriptionData, setAgreementData } = dashboardSlice.actions;
export default dashboardReducer;
