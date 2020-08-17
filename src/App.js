import React from 'react'
import './App.css'
import axios from 'axios'
function App() {
	const [allBlob, setAllBlob] = React.useState([])
	const setFile = (e) => {
		preCompresss(e.target.files)
	}
	const compresss = (file, type, newWidth, quality) => {
		const reader = new FileReader()
		reader.readAsDataURL(file)
		reader.onload = (event) => {
			const img = new Image()
			img.src = event.target.result
			img.onload = () => {
				const elem = document.createElement('canvas')
				elem.width = newWidth
				elem.height = (img.height / img.width) * newWidth
				const ctx = elem.getContext('2d')
				ctx.drawImage(img, 0, 0, elem.width, elem.height)
				ctx.canvas.toBlob(
					(blob) => {
						setAllBlob((allBlob) => [...allBlob, blob])
					},
					type,
					quality
				)
			}
			reader.onerror = (error) => console.log(error)
		}
	}

	const preCompresss = (files) => {
		for (const key in files) {
			if (files.hasOwnProperty(key)) {
				const file = files[key]
				console.log(file.size)
				compresss(file, 'image/jpeg', 1080, 0.95)
			}
		}
	}
	const submit = async (e) => {
		e.preventDefault()
		var formDataToUpload = new FormData()
		for (const iterator of allBlob) {
			formDataToUpload.append('img[]', iterator)
		}
		let res = await axios({
			method: 'post',
			url: 'http://localhost:8000/upload',
			data: formDataToUpload,
			headers: { 'Content-Type': 'multipart/form-data' },
		})
		alert(res.data.msg)
	}
	return (
		<div className='App'>
			<header className='App-header'>
				<div>
					<form onSubmit={submit}>
						<input type='file' onChange={setFile} multiple />
						<input type='submit' value='upload' />
					</form>
				</div>
			</header>
		</div>
	)
}

export default App
