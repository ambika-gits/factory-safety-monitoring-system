import torch

model = torch.jit.load("best.torchscript")

print(model)