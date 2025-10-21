import { createSlice } from "@reduxjs/toolkit";

const linkSharedSlice = createSlice({
  name: "linkShared",
  initialState: {
    position: {
      x: typeof localStorage !== "undefined" ? (parseFloat(localStorage.getItem('dragX')) || 0) : null,
      y: typeof localStorage !== "undefined" ? (parseFloat(localStorage.getItem('dragY')) || 0) : null,
    },
    calendarLink: false,
    copyLink: false,
    emailLink: false,
    expiresLink: false,
    veritLink: false,
    qrCodeLink: false,
    whatsAppLink: false,
    facebookLink: false,
    twitterLink: false,
    messagesLink: false,
    customiseALinkModalOpened: false,
    customiseALinkCopied: false,
    setPasswordModalOpened: false,
    setPasswordCompleted: false,
    downloadTickClick:false, //used in DownloadPasswordC component and DOWNLOADHERO COmponent
    previewModalopened:false,
    pricing:false,
  },
  reducers: {
    updatePosition: (state, action) => {
      const { x, y } = action.payload;
      state.position.x = x;
      state.position.y = y;
    },
    CalendarLinkShared: (state, action) => {
      state.calendarLink = action.payload;
    },
    CopyLinkShared: (state, action) => {
      state.copyLink = action.payload;
    },
    EmailLinkShared: (state, action) => {
      state.emailLink = action.payload;
    },
    ExpiresLinkShared: (state, action) => {
      state.expiresLink = action.payload;
    },
    VeritLinkShared: (state, action) => {
      state.veritLink = action.payload;
    },
    QRCodeLinkShared: (state, action) => {
      state.qrCodeLink = action.payload;
    },
    WhatsappLinkShared: (state, action) => {
      state.whatsAppLink = action.payload;
    },
    MessagesLinkShared: (state, action) => {
      state.messagesLink = action.payload;
    },
    FacebookLinkShared: (state, action) => {
      state.facebookLink = action.payload;
    },
    TwitterLinkShared: (state, action) => {
      state.twitterLink = action.payload;
    },
    CutomiseALinkModalOpened: (state, action) => {
      state.customiseALinkModalOpened = action.payload;
    },
    CustomiseALinkCopied: (state, action) => {
      state.customiseALinkCopied = action.payload;
    },
    SetPasswordModalOpened: (state, action) => {
      state.setPasswordModalOpened = action.payload;
    },
    SetPasswordCompleted: (state, action) => {
      state.setPasswordCompleted = action.payload;
    },
    SetDownloadTickClick: (state, action) =>{
      state.downloadTickClick = action.payload
    },
    // MainSharingModal:(state) =>{
    //   state.initialState.calendarLink = false
    //   state.initialState.expiresLink = false
    // }
    SetPreviewModalOpened:(state,action) => {
      state.previewModalopened = action.payload
    },
    termsOfServieModalOpened: (state, action) => {
      state.termsOfService = action.payload;
    },
    setPricing: (state, action) => {
      state.pricing = action.payload
    }
  },
});
export const {
  updatePosition,
  CalendarLinkShared,
  CopyLinkShared,
  EmailLinkShared,
  ExpiresLinkShared,
  VeritLinkShared,
  QRCodeLinkShared,
  WhatsappLinkShared,
  MessagesLinkShared,
  FacebookLinkShared,
  TwitterLinkShared,
  CutomiseALinkModalOpened,
  CustomiseALinkCopied,
  SetPasswordModalOpened,
  SetPasswordCompleted,
  SetDownloadTickClick,
  SetPreviewModalOpened,
  setPricing
} = linkSharedSlice.actions;
export default linkSharedSlice.reducer;
