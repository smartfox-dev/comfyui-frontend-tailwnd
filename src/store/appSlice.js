import { createSlice } from '@reduxjs/toolkit'

export const appSlice = createSlice({
  name: 'app',
  initialState: {
    homeSetting: null,
    user: null,
    token: null,
    loading: false,
    isAdmin: false,
    segment: null,
    messages: [],
    widgetbotIndex: 0,
    sitewidebotIndex: 0,
    modelsList: [],
    brandsList: [],
    aestheticsList: [],
    clothingList: [],
    selectedSidebar: 'Models',
    loadingFlag: false,
    generatedImg: '',
    promptValue: {
      models: {},
      brands: {},
      aesthetics: [],
      clothing: [],
    }
  },
  reducers: {
    setUser: (state, action) => {
      state.user = action.payload;
      state.profile = action.payload?.profile || null
      state.isAdmin = action.payload?.role === 'ADMIN'
    },
    setToken: (state, action) => {
      if (action.payload)
        state.token = action.payload
      else {
        state.token = null;
        state.user = null;
      }
    },
    setLoadingFlag: (state, action) => {
      state.loadingFlag = action.payload;
    },
    setGeneratedImg: (state, action) => {
      state.generatedImg = action.payload;
    },
    setPromptValue: (state, action) => {
      if (action.payload) {
        const { models, brands, aesthetics, clothing } = action.payload;
        state.promptValue.models = models;
        state.promptValue.brands = brands;
        state.promptValue.aesthetics = aesthetics;
        state.promptValue.clothing = clothing;
      }
    },
    setModelsList: (state, action) => {
      if(action.payload){
        state.modelsList = action.payload;
      }
    },
    setBrandsList: (state, action) => {
      if(action.payload) {
        state.brandsList = action.payload
      }
    },
    setAestheticsList: (state, action) => {
      if(action.payload){
        state.aestheticsList = action.payload;
      }
    },
    setClothingList: (state, action) => {
      if(action.payload){
        state.clothingList = action.payload;
      }
    },
    setSelectedSidebar: (state, action) => {
      state.selectedSidebar = action.payload;
    },
    setHomeSetting: (state, action) => {
      if (state.homeSetting) {
        state.homeSetting = {
          ...state.homeSetting,
          ...action.payload
        }
      } else {
        state.homeSetting = action.payload
      }
    },
    setSegment: (state, action) => {
      state.segment = action.payload
    },
    setMessages: (state, action) => {
      state.messages = action.payload
    },
    addMessage: (state, action) => {
      state.messages = [
        ...state.messages,
        action.payload
      ]
    },
    shiftMessage: (state, action) => {
      state.messages = state.messages.slice(0, state.messages.length - 1)
    },
    setWidgetbotIndex: (state, action) => {
      state.widgetbotIndex = action.payload
    },
    setSitewidebotIndex: (state, action) => {
      state.sitewidebotIndex = action.payload
    },
    setLoading: (state, action) => {
      state.loading = action.payload
    }
  }
})

// Action creators are generated for each case reducer function
export const { setUser, setToken, setLoadingFlag, setGeneratedImg, setPromptValue, setModelsList, setBrandsList, setAestheticsList, setClothingList, setSelectedSidebar, setHomeSetting, setSegment, setLoading, setMessages, addMessage, shiftMessage, setWidgetbotIndex, setSitewidebotIndex } = appSlice.actions

export default appSlice.reducer