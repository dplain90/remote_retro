const exitSound = "data:audio/mpeg;base64,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 AAAAAAAAAAAAAAAAAAAAAAAA/w=="

export default exitSound