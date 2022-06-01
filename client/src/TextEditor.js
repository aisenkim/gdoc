import { useCallback, useEffect, useRef, useState } from "react";
import axios from "axios";
import Quill from "quill";
import "quill/dist/quill.snow.css";
import { useParams } from "react-router-dom";
import { list } from "quill/ui/icons";
import { v4 as uuidV4 } from "uuid";

const toolbarOptions = [
  ["bold", "italic", "underline", "strike"], // toggled buttons
  ["blockquote", "code-block"],

  [{ header: 1 }, { header: 2 }], // custom button values
  [{ list: "ordered" }, { list: "bullet" }],
  [{ script: "sub" }, { script: "super" }], // superscript/subscript
  [{ indent: "-1" }, { indent: "+1" }], // outdent/indent
  [{ direction: "rtl" }], // text direction

  [{ size: ["small", false, "large", "huge"] }], // custom dropdown
  [{ header: [1, 2, 3, 4, 5, 6, false] }],

  [{ color: [] }, { background: [] }], // dropdown with defaults from theme
  [{ font: [] }],
  [{ align: [] }],

  ["clean"], // remove formatting button
];

let queue = [];

export default function TextEditor() {
  const [socket, setSocket] = useState();
  const [eventSource, setEventSource] = useState();
  const [quill, setQuill] = useState();
  const [quillSetup, setQuillSetup] = useState(false);
  const [initOp, setInitOp] = useState(null);
  const [initOpSet, setInitOpSet] = useState(false);
  const [listening, setListening] = useState(false);
  const { DOCID: documentId } = useParams(); // renaming id as documentId

  const uid = uuidV4();

  let version = 1;

  const handleReceiveMessage = (e) => {
    let data = JSON.parse(e.data);
    handler(data);
  };

  const handler = (delta) => {
    // quill.setContents([{ insert: 'zzzz ' }, { insert: 'efg', attributes: {bold : true} }, { insert: ' hijk' } ]);
    console.log(delta);
    if (delta.content) {
      // console.log(delta.content)
      console.log(delta.version);
      quill.setContents(delta.content);
      version = delta.version;
      // delta.content.forEach(operation => {
      // console.log(operation)
      // quill.updateContents([operation]);
      // quill.updateContents(operation);
      // })
    } else if (delta.ack) {
      console.log("Inside delta->ack. Increase the version");
      console.log(delta);
      version++;
      // quill.updateContents(delta.op);
      // delta.forEach(operation => {
      //     quill.updateContents(operation);
      // })
    } else if (delta) {
      console.log("not content and ack --> ");
      console.log(delta);
      // delta.forEach(operation => {
      //     quill.updateContents(operation);
      // })
      quill.updateContents(delta);
      version++;
    }
  };

  // Initialize the socket
  useEffect(() => {
    if (!quillSetup) return;

    if (!listening && quillSetup) {
      console.log("*****************");
      const eventSource = new EventSource(
        process.env.REACT_APP_API_URL + `/doc/connect/${documentId}/${uid}`,
        { withCredentials: true }
      );
      console.log(`eventSource: `);
      console.log(eventSource);
      console.log("*****************");
      setEventSource(eventSource);
      eventSource.addEventListener("message", handleReceiveMessage);
      setListening(true);
      setQuillSetup(false);
    }

    // return() => {
    //     console.log("RETURN")
    //     eventSource.removeEventListener("message", handleReceiveMessage);
    //     eventSource.close();
    // }

    // }, []);
  }, [quillSetup, listening]);

  /**
   * [SEND CHANGES TO SERVER]
   * use effect for quiil sending changes to the server
   * delta - what is changing (subset) not whole document
   */
  useEffect(() => {
    // don't execute if socket or quil is null
    if (quill == null) return;
    const handler = (delta, oldDelta, source) => {
      // queue.push([...delta.ops]);
      console.log("The DELTA --> ");
      console.log(delta);
      console.log("UID: ", uid);
      if (source !== "user") return; // only keep track of user changes
      // axios.post(process.env.REACT_APP_API_URL + `/doc/op/${documentId}/${uid}`, {version, op: [delta.ops]}, {withCredentials: true})
      axios.post(
        process.env.REACT_APP_API_URL + `/doc/op/${documentId}/${uid}`,
        { version, op: delta.ops },
        { withCredentials: true }
      );
      // axios.post(`http://chk.cse356.compas.cs.stonybrook.edu/doc/op/${documentId}`,[delta.ops])
      console.log("#############");
      // socket.emit("send-changes", delta); // send to server
    };

    quill.on("text-change", handler);

    return () => {
      quill.off("text-change", handler);
    };
  }, [quill]);

  /**
   * [RECEIVE CHANGES FROM THE SERVER]
   */
  // useEffect(() => {
  //     // don't execute if socket or quil is null
  //     if (quill == null || eventSource == null) return;
  //
  //
  //
  //     eventSource.addEventListener("message", handleReceiveMessage);
  //     return () => {
  //         // Remove event listener and close the connection on unmount
  //         eventSource.removeEventListener("message", handleReceiveMessage);
  //         eventSource.close();
  //     };
  //
  //
  // }, [initOp, quillSetup, eventSource]);

  // useEffect(() => {
  //     if (socket == null || quill == null) return;
  //
  //     // loading document from the server
  //     socket.once("load-document", document => {
  //         quill.setContents(document);
  //         quill.enable();
  //     })
  //
  //     socket.emit("get-document", documentId); // tell server which document we are editing
  // }, [socket, quill, documentId]);

  useEffect(() => {
    if (socket == null || quill == null) return;

    // set timer every ... seconds
    const interval = setInterval(() => {
      socket.emit("save-document", quill.getContents());
    }, 2000);

    return () => {
      clearInterval(interval);
    };
  }, [socket, quill, documentId]);

  // Set the editor display using Quill API
  const wrapper = useCallback((wrapper) => {
    if (wrapper == null) return; //
    wrapper.innerHTML = "";
    const editor = document.createElement("div");
    wrapper.append(editor);
    const initQuill = new Quill(editor, {
      theme: "snow",
      modules: { toolbar: toolbarOptions },
    });
    // initQuill.disable();
    setQuill(initQuill);
    setQuillSetup(true); // finished setting up
  }, []);

  return <div className="container" ref={wrapper}></div>;
}
