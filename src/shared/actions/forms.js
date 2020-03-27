import uuidv4 from 'uuidv4'
import {
  SET_PARAMS,
  SET_OPTIONS,
  FORM_PERSISTED,
  CLEAR_PARAMS,
  SET_CURRENT_POST,
  SET_CURRENT_POST_TEMPLATE,
} from 'constants/actionTypes'

//override will totally override whatever params are there; otherwise, will just be merged to state
export const setParams = (component, form, params, dirty = true, override) => {
  const payload = {
    component,
    form,
    params,
    dirty,
    override,
  }

  store.dispatch({type: SET_PARAMS, payload})
}

export const setOptions = (component, form, options) => {
  const payload = {
    component,
    form,
    options,
  }

  store.dispatch({type: SET_OPTIONS, payload })
}

export const uploadFile = (file) => {
  return new Promise((resolve, reject) => {
    const formData = new FormData()
    //rename to ensure unique path, and will work as link AND for background image
    //some of the regex is overkill...but whatever
    let newName = `${uuidv4()}-${file.name.replace(/\(,|\/|\\|\s|\?|:|@|&|=|\+|#\)+/g, "_")}`
    //NOTE: using the File API might make incompatibility with old IE11, Edge 16, old android
    let namedFile = new File([file], newName, {type: file.type})

    formData.append("fileToUpload", namedFile)
    formData.append("user", store.getState().user)
    axios.post("/upload", formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      }
    })
    .then((result) => {
      const uploadedFile = result.data

      return resolve(uploadedFile)
    })
    .catch((err) => {
      console.log("fail to upload");
      console.error(err);
      return reject(err)
    })

  })
}

//makes it not dirty anymore
export const formPersisted = (component, form) => {
  store.dispatch({
    type: FORM_PERSISTED,
    payload: {
      component,
      form,
    },
  })
}
export const clearParams = (component, form) => {
  store.dispatch({
    type: CLEAR_PARAMS,
    payload: {
      component,
      form,
    },
  })
}


//basically, the post you are working on will reflect the same data it had, and params are ready to persisted if you update again
//other campaign params is set too; each "form" is a campaign attribute
export const matchCampaignStateToRecord = () => {
  //this should match the persisted recoard
  const campaign = Object.assign({}, Helpers.safeDataPath(store.getState(), `currentCampaign`, {}))
  const campaignPosts = campaign.posts || []
  //convert to object for easy getting/setting
  const postObj = campaignPosts.reduce((acc, post) => {
    acc[post.id] = _.cloneDeep(post)
    return acc
  }, {})

  if (Object.keys(postObj).length) {
    //sets dirty to false, and override to true
    setParams("EditCampaign", "posts", postObj, false, true)
  } else {
    clearParams("EditCampaign", "posts")
  }

  //clear current post template if it's just a draft too (real records are integers)
  if (typeof Helpers.safeDataPath(store.getState(), "currentPost.id", "") === "string") {
    store.dispatch({type: SET_CURRENT_POST, payload: null})
  }

  delete campaign.posts //will not be updating posts on that part of the state, so don't want to confuse things; just remove it

  //sets dirty to false, and override to true
  setParams("EditCampaign", "other", campaign, false, true)
}

//basically, the postTemplate you are working on will reflect the same data it had, and params are ready to persisted if you update again
//other plan params is set too; each "form" is a plan attribute
//watch out: doesn't change
export const matchPlanStateToRecord = () => {
  //this should match the persisted recoard
  const plan = Object.assign({}, Helpers.safeDataPath(store.getState(), `currentPlan`, {}))
  const planPostTemplates = plan.postTemplates || []
  //convert to object for easy getting/setting
  const postTemplateObj = planPostTemplates.reduce((acc, template) => {
    acc[template.id] = _.cloneDeep(template) //make sure it's not the same object, so when params change record doesn't
    return acc
  }, {})

  if (Object.keys(postTemplateObj).length) {
    //sets dirty to false, and override to true
    setParams("EditPlan", "postTemplates", postTemplateObj, false, true)
  } else {
    clearParams("EditPlan", "postTemplates")
  }

  //clear current post template if it's just a draft too  (real records are integers)
  if (typeof Helpers.safeDataPath(store.getState(), "currentPostTemplate.id", "") === "string") {
    store.dispatch({type: SET_CURRENT_POST_TEMPLATE, payload: null})
  }

  delete plan.postTemplates //will not be updating posts on that part of the state, so don't want to confuse things; just remove it

  //sets dirty to false, and override to true
  setParams("EditPlan", "other", plan, false, true)
}

