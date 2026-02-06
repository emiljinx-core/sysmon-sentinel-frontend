# 🛡️ Sysmon Sentinel

> AI-powered threat detection and analysis system for Windows Sysmon event logs

🚀 Live Demo: https://smartcti.vercel.app

📦 Full Research Repository: https://github.com/emiljinx-core/sysmon-sentinel

Sysmon Sentinel is an end-to-end machine learning system that classifies Windows Sysmon logs as benign or malicious using transformer-based models, ensemble learning techniques, and an interactive AI-powered analysis interface.

## ✨ Features

- **🤖 Dual Transformer Models**: DistilBERT and TinyBERT fine-tuned for log classification
- **🎯 Ensemble Learning**: Hard voting, soft voting, and stacking ensemble methods
- **📊 High Accuracy**: Achieves 97.61% accuracy with best-performing models
- **💻 Interactive UI**: Next.js dashboard with AI-powered threat explanations
- **🔍 Log Analysis**: Real-time "Why Benign/Malicious?" insights using Groq LLaMA 3
- **📈 Comprehensive Metrics**: ROC curves, precision-recall curves, and confusion matrices

## 🏆 Model Performance

| Model | Accuracy | Precision | Recall | F1 Score | AUC |
|-------|----------|-----------|--------|----------|-----|
| DistilBERT | 96.10% | 97.72% | 94.97% | 96.33% | 0.9926 |
| TinyBERT | **97.61%** | 96.30% | 99.40% | **97.82%** | 0.9948 |
| Soft Voting | 97.18% | 97.96% | 96.78% | 97.37% | **0.9972** |
| Stacking Ensemble | **97.61%** | 97.98% | 97.58% | **97.78%** | 0.9971 |

## 📁 Project Structure

```
SLM_Project/
├── logs/                      # Preprocessed Sysmon event logs
│   ├── benign_events.csv
│   ├── malicious_events.csv
│   ├── train.csv
│   ├── val.csv
│   └── test.csv
├── models/                    # Trained transformer models
│   ├── distilbert-sysmon-final/
│   └── tinybert-sysmon-final/
├── results/                   # Evaluation outputs & visualizations
│   ├── preds_*.csv
│   ├── confmat_*.png
│   ├── roc_all_models.png
│   └── pr_all_models.png
├── scripts/                   # Training & evaluation scripts
│   ├── train_distilbert.py
│   ├── train_tinybert.py
│   ├── evaluate_*.py
│   ├── ensemble_*.py
│   └── preprocess_logs.py
└── frontend/                  # Next.js web interface
    └── app/
```

## 🚀 Getting Started

### Prerequisites

- Python 3.8+
- Node.js 18+
- Git LFS (for model files)
- CUDA-capable GPU (recommended)

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/emiljinx-core/SLMResearch.git
   cd SLMResearch
   ```

2. **Set up Git LFS for model files**
   ```bash
   git lfs install
   git lfs track "*.bin" "*.safetensors" "*.pt" "*.json"
   git lfs pull
   ```

3. **Install Python dependencies**
   ```bash
   pip install -r requirements.txt
   ```

4. **Install frontend dependencies**
   ```bash
   cd frontend
   npm install
   ```

### Usage

#### Training Models

Train the DistilBERT model:
```bash
python scripts/train_distilbert.py
```

Train the TinyBERT model:
```bash
python scripts/train_tinybert.py
```

#### Evaluation

Evaluate individual models:
```bash
python scripts/evaluate_distilbert.py
python scripts/evaluate_tinybert.py
```

Run ensemble methods:
```bash
python scripts/ensemble_soft_voting.py
python scripts/ensemble_stacking.py
```

#### Launch Web Interface

```bash
cd frontend
npm run dev
```

Navigate to `http://localhost:3000` to access the AI Log Analyzer dashboard.

## 🎨 Frontend Features

The Next.js web interface provides:

- **Dual-tab layout**: Separate views for benign and malicious logs
- **Expandable log entries**: Full JSON event details
- **AI-powered analysis**: 
  - "Why Benign?" explanations
  - "Why Malicious?" threat breakdowns
  - "What Should User Do?" actionable recommendations
- **Real-time inference**: Groq LLaMA 3 API integration
- **Cybersecurity-themed UI**: Built with ShadCN UI and Framer Motion

## 📊 Evaluation Metrics

The system generates comprehensive performance reports including:

- Confusion matrices for each model
- ROC curves (Receiver Operating Characteristic)
- Precision-Recall curves
- Per-class performance metrics
- Model comparison tables

## 🛠️ Technologies Used

### Machine Learning
- PyTorch
- Hugging Face Transformers
- Scikit-learn
- Pandas & NumPy

### Frontend
- Next.js 14 (App Router)
- React
- ShadCN UI
- Framer Motion
- Tailwind CSS

### AI Integration
- Groq API (LLaMA 3)

## 📝 Dataset

The system processes Windows Sysmon event logs containing:
- Process creation events
- Network connections
- File modifications
- Registry changes
- Driver loads

Logs are preprocessed, cleaned, and split into stratified train/validation/test sets.

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- Windows Sysmon for event logging capabilities
- Hugging Face for transformer models
- Groq for LLaMA 3 API access

## 📧 Contact

Project Maintainer - [@emiljinx-core](https://github.com/emiljinx-core)

Project Link: [https://github.com/emiljinx-core/SLMResearch](https://github.com/emiljinx-core/SLMResearch)

---

<div align="center">
Made with ❤️ for cybersecurity professionals
</div>
