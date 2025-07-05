# Use Python 3.12 slim image
FROM python:3.12-slim

# Set working directory
WORKDIR /app

# Install system dependencies
RUN apt-get update && apt-get install -y \
    build-essential \
    python3-dev \
    && rm -rf /var/lib/apt/lists/*

# Copy requirements first for better caching
COPY requirements.txt .

# Install Python dependencies
RUN pip install --no-cache-dir -r requirements.txt

# Copy the model file separately to ensure it's included
COPY mobilenetv2_stage_model.h5 .

# Copy the rest of the application
COPY . .

# Create uploads directory
RUN mkdir -p uploads

# Verify model file exists and is readable
RUN ls -l mobilenetv2_stage_model.h5 && \
    python3 -c "from tensorflow.keras.models import load_model; model = load_model('mobilenetv2_stage_model.h5')" || \
    (echo "Error: Model file is missing or cannot be loaded!" && exit 1)

# Set environment variables
ENV PYTHONUNBUFFERED=1
ENV PORT=8080

# Expose port
EXPOSE 8080

# Run the application
CMD ["gunicorn", "--bind", "0.0.0.0:8080", "app:app"] 