import { Modal, IconButton, Box, Fade, Backdrop, Zoom, Typography, Grow, Avatar } from "@mui/material"
import CloseIcon from "@mui/icons-material/Close"
import FullscreenIcon from "@mui/icons-material/Fullscreen"

const ImageModal = ({ Opened, ImgUrl, OnClose }) => {
	return (
		<Box component="div" sx={{ width: "100%" }}>
			{/* Modal */}
			<Modal
				open={Opened}
				onClose={()=> OnClose()}
				aria-labelledby="modal-modal-title"
				aria-describedby="modal-modal-description"
				BackdropComponent={Backdrop}
				BackdropProps={{
					timeout: 300,
					sx: {
						backgroundColor: "rgba(0, 0, 0, 0.9)",
						backdropFilter: "blur(5px)",
					},
				}}
				sx={{
					display: "flex",
					alignItems: "center",
					justifyContent: "center",
					margin: 0,
					padding: 0,
					"& .MuiBackdrop-root": {
						backgroundColor: "rgba(0, 0, 0, 0.9)",
					},
				}}>
				<Box
					sx={{
						position: "relative",
						width: "auto",
						maxWidth: "90vw",
						maxHeight: "90vh",
						m: 0,
						p: 0,
						outline: "none",
						"&:focus": {
							outline: "none",
						},
					}}>
					{/* <Avatar alt="Image Preview" src={ImgUrl} sx={{
						width: "auto",
						height: "auto",
						borderRadius:"20px",
						transition: "width 0.5s ease-in-out, height 0.5s ease-in-out",
						}}>
					</Avatar> */}
					{/* Close Button */}
					<IconButton 
						onClick={()=>OnClose()}
						sx={{
							position: "absolute",
							right: 16,
							top: 16,
							color: "white",
							bgcolor: "rgba(0,0,0,0.6)",
							zIndex: 1,
							padding: 1,
							transition: "all 0.1s ease-in-out",
							"&:hover": {
								bgcolor: "rgba(0,0,0,0.8)",
								transform: "scale(1.1)",
							},
						}}
						size="large">
						<CloseIcon sx={{ fontSize: 24 }} />
					</IconButton>
					{/* Modal Image */}
					<img className="block w-full max-h-[80vh] m-auto object-contain rounded-xl"
						src={ImgUrl}
						alt="Image Preview"
					/>
				</Box>
			</Modal>
		</Box>
	)
}

export default ImageModal
