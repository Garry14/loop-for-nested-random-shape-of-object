import PropTypes from "prop-types"
import Label from "./label"
import Cover from "./cover"
import draftToHtml from "draftjs-to-html"
import {
  EditorState,
  convertToRaw,
  ContentState,
  convertFromHTML,
  RichUtils,
  KeyBindingUtil
} from "draft-js"
import dynamic from "next/dynamic"
import { useState, useEffect } from "react"

const Editor = dynamic(
  () => import("react-draft-wysiwyg").then((mod) => mod.Editor),
  { ssr: false }
)

const AfterLoad = ({
  setFieldValue,
  name = "",
  value,
  toolbarOptions = [
    "inline",
    "blockType",
    "fontSize",
    "list",
    "textAlign",
    "colorPicker",
    "link",
    "embedded",
    "emoji",
    "remove",
    "history",
  ],
  wrapperClassName = "demo-wrapper",
  editorClassName = "demo-editor px-3",
}) => {
  const [editorState, setEditorState] = useState(() => {
    let convertedToHTML = decodeURIComponent(value)
    const blocksFromHtml = convertFromHTML(convertedToHTML)
    const { contentBlocks, entityMap } = blocksFromHtml
    const contentState = ContentState.createFromBlockArray(
      contentBlocks,
      entityMap
    )
    return EditorState.createWithContent(contentState)
  })
  return (
    <Editor
      wrapperClassName={wrapperClassName}
      editorClassName={editorClassName}
      editorState={editorState}
      onEditorStateChange={async (editorVal) => {
        await setEditorState(editorVal)
        setFieldValue(
          name,
          draftToHtml(convertToRaw(editorState.getCurrentContent()))
        )
      }}
      toolbar={{
        options: toolbarOptions,
      }}
      handleReturn={async (evt) => {
        const blockType = RichUtils.getCurrentBlockType(editorState)
        if (blockType !== 'unstyled') {
          return 'not_handled'
        }
        const newState = RichUtils.insertSoftNewline(editorState)
        // this.onChange(newState)
        await setEditorState(newState)
        console.log(newState, draftToHtml(convertToRaw(editorState.getCurrentContent())))
        setFieldValue(
          name,
          draftToHtml(convertToRaw(editorState.getCurrentContent()))
        )
        return 'handled'
      }}
    />
  )
}

const BeforeLoad = ({
  setFieldValue,
  name = "",
  toolbarOptions = [
    "inline",
    "blockType",
    "fontSize",
    "list",
    "textAlign",
    "colorPicker",
    "link",
    "embedded",
    "emoji",
    "remove",
    "history",
  ],
  wrapperClassName = "demo-wrapper",
  editorClassName = "demo-editor px-3",
}) => {
  const [editorState, setEditorState] = useState(EditorState.createEmpty())
  return (
    <Editor
      wrapperClassName={wrapperClassName}
      editorClassName={editorClassName}
      editorState={editorState}
      onEditorStateChange={async (editorVal) => {
        await setEditorState(editorVal)
        setFieldValue(
          name,
          draftToHtml(convertToRaw(editorState.getCurrentContent()))
        )
      }}
      toolbar={{
        options: toolbarOptions,
      }}
    />
  )
}

const InputEditor = ({
  setFieldValue,
  idInstance = "",
  label = "Nama",
  placeholder = "",
  tabIndex,
  error = false,
  name = "",
  required,
  disabled = false,
  value,
  height = "h-full",
  resize = "none",
  toolbarOptions = [
    "inline",
    "blockType",
    "fontSize",
    "list",
    "textAlign",
    "colorPicker",
    "link",
    "embedded",
    "emoji",
    "remove",
    "history",
  ],
  wrapperClassName = "demo-wrapper",
  editorClassName = "demo-editor px-3",
}) => {
  const [loadValue, setLoadValue] = useState(null)

  useEffect(() => {
    if (!!value) setLoadValue(value)
  }, [value])

  return (
    <>
      <Label
        idInstance={`input--${idInstance}`}
        text={label}
        required={required}
      >
        {disabled ? (
          <div
            className={`relative h-150-px overflow-auto bg-color-bord w-full px-3 border rounded-4-rpx`}
          >
            <span className="global--disabled--span">{value}</span>
          </div>
        ) : (
          <Cover error={error} height={height} hPadding="px-0">
            <div
              className="h-auto w-auto focus:ring-0 focus:outline-none automated"
              id={`input--${idInstance}`}
            >
              {loadValue ? (
                <AfterLoad
                  setFieldValue={setFieldValue}
                  name={name}
                  value={loadValue}
                  wrapperClassName={wrapperClassName}
                  editorClassName={editorClassName}
                  toolbarOptions={toolbarOptions}
                />
              ) : (
                <BeforeLoad
                  setFieldValue={setFieldValue}
                  name={name}
                  wrapperClassName={wrapperClassName}
                  editorClassName={editorClassName}
                  toolbarOptions={toolbarOptions}
                />
              )}
            </div>
          </Cover>
        )}
      </Label>
      <style jsx>{`
        textarea {
          resize: ${resize};
        }
      `}</style>
    </>
  )
}

InputEditor.propTypes = {
  setFieldValue: PropTypes.func,
  idInstance: PropTypes.string,
  placeholder: PropTypes.string,
  label: PropTypes.string,
  tabIndex: PropTypes.number,
  disabled: PropTypes.bool,
  error: PropTypes.bool,
  name: PropTypes.string,
  value: PropTypes.any,
  required: PropTypes.bool,
  rows: PropTypes.number,
  height: PropTypes.string,
  resize: PropTypes.oneOf(["none", "vertical", "horizontal"]),
}

export default InputEditor
