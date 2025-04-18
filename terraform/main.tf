resource "yandex_compute_disk" "boot-disk-1" {
  name     = "boot-disk-1"
  type     = "network-hdd"
  zone     = "ru-central1-d"
  size     = "50"
  # image_id = "fd8sq3r72r0caul0fn37"
  image_id = "fd89esja5ecg35fu6n2t" #container-optimized-image
}

resource "yandex_compute_instance" "vm-1" {
  name        = "terraform1"
  platform_id = "standard-v2"

  resources {
    # core_fraction = 50
    cores  = 4
    memory = 16
  }

  boot_disk {
    disk_id = yandex_compute_disk.boot-disk-1.id
  }

  network_interface {
    subnet_id = yandex_vpc_subnet.subnet-1.id
    nat       = true
  }

  metadata = {
    user-data = "${file("../../meta.yaml")}"
  }

  scheduling_policy {
    preemptible = true
  }  
}

resource "yandex_vpc_network" "network-1" {
  name = "network1"
}

resource "yandex_vpc_subnet" "subnet-1" {
  name           = "subnet1"
  zone           = "ru-central1-d"
  network_id     = yandex_vpc_network.network-1.id
  v4_cidr_blocks = ["192.168.10.0/24"]
}

resource "null_resource" "transfer_yml" {
  connection {
    type = "ssh"
    user = "devopser"
    host = yandex_compute_instance.vm-1.network_interface.0.nat_ip_address
    agent       = true
    timeout     = "1m"
  }  
  provisioner "file" {
    source      = "../miniqube"
    destination = "/home/devopser/miniqube"
  }
  depends_on = [yandex_compute_instance.vm-1]
}

resource "null_resource" "miniqube_install" {
  connection {
    type = "ssh"
    user = "devopser"
    host = yandex_compute_instance.vm-1.network_interface.0.nat_ip_address
    agent       = true
    timeout     = "1m"
  }    
  provisioner "remote-exec" {
    inline = [
      "sudo apt update",
      "sudo apt install curl apt-transport-https",
      "sudo apt install ca-certificates",
      "sudo curl -fsSLo /etc/apt/keyrings/kubernetes-archive-keyring.gpg https://packages.cloud.google.com/apt/doc/apt-key.gpg",
      # "sudo curl -LO \"https://storage.googleapis.com/kubernetes-release/release/$(curl -s https://storage.googleapis.com/kubernetes-release/release/stable.txt)/bin/linux/amd64/kubectl\"",
      # "sudo apt install -y kubectl",
      "sudo curl -LO https://dl.k8s.io/release/`curl -LS https://dl.k8s.io/release/stable.txt`/bin/linux/amd64/kubectl",
      "sudo chmod +x ./kubectl",
      "sudo mv ./kubectl /usr/local/bin/kubectl",
      "sudo kubectl version",
      "sudo kubectl create sa default",
      "curl -LO https://storage.googleapis.com/minikube/releases/latest/minikube-linux-amd64",
      "sudo install minikube-linux-amd64 /usr/local/bin/minikube",
      "minikube version",
    ]    
  }
  depends_on = [null_resource.transfer_yml]
}

resource "null_resource" "miniqube_run" {
  connection {
    type = "ssh"
    user = "devopser"
    host = yandex_compute_instance.vm-1.network_interface.0.nat_ip_address
    agent       = true
    timeout     = "1m"
  }    
  provisioner "remote-exec" {
    inline = [
      # "sudo usermod -aG docker $USER && newgrp docker",
      "minikube config set cpus 4",
      "minikube config set memory 8000",
      "minikube start --driver=docker",
      # "sudo minikube config set driver docker",
      "minikube docker-env",
      # "kubectl apply -f /home/devopser/miniqube",
    ]    
  }
  depends_on = [null_resource.miniqube_install]
}

resource "null_resource" "services_started" {
  connection {
    type = "ssh"
    user = "devopser"
    host = yandex_compute_instance.vm-1.network_interface.0.nat_ip_address
    agent       = true
    timeout     = "1m"
  }    
  provisioner "remote-exec" {
    inline = [
      "cd /home/devopser/miniqube",
      "kubectl apply -f ./postgres-service.yaml",
      "kubectl apply -f ./postgres-deployment.yaml",
      "kubectl apply -f ./postgres-cm1-configmap.yaml",
      "kubectl apply -f ./postgres-claim0-persistentvolumeclaim.yaml",
      "kubectl apply -f ./prometheus-service.yaml",
      "kubectl apply -f ./prometheus-deployment.yaml",
      "kubectl apply -f ./prometheus-cm0-configmap.yaml",
      "kubectl apply -f ./node-exporter-service.yaml",
      "kubectl apply -f ./node-exporter-deployment.yaml",
      "kubectl apply -f ./node-exporter-claim0-persistentvolumeclaim.yaml",
      "kubectl apply -f ./node-exporter-claim1-persistentvolumeclaim.yaml",
      "kubectl apply -f ./pgadmin-service.yaml",
      "kubectl apply -f ./pgadmin-deployment.yaml",
      "kubectl apply -f ./pgadmin-data-persistentvolumeclaim.yaml",
      "kubectl apply -f ./pgadmin-service.yaml",
      "kubectl apply -f ./grafana-service.yaml",
      "kubectl apply -f ./grafana-deployment.yaml",
      "kubectl apply -f ./grafana-claim0-persistentvolumeclaim.yaml",
      "kubectl apply -f ./backand-service.yaml",
      "kubectl apply -f ./backand-deployment.yaml",
      "kubectl apply -f ./backand-horizontalpodautoscaler.yaml",
      "kubectl apply -f ./frontend-service.yaml",
      "kubectl apply -f ./frontend-deployment.yaml",
      "kubectl patch svc postgres -p '{\"spec\":{\"externalIPs\":[\"192.168.49.2\"]}}'",
      "kubectl patch svc frontend -p '{\"spec\":{\"externalIPs\":[\"192.168.49.2\"]}}'",
      "kubectl patch svc backand -p '{\"spec\":{\"externalIPs\":[\"192.168.49.2\"]}}'",
      "kubectl patch svc pgadmin -p '{\"spec\":{\"externalIPs\":[\"192.168.49.2\"]}}'",
      "kubectl patch svc grafana -p '{\"spec\":{\"externalIPs\":[\"192.168.49.2\"]}}'",
      "kubectl patch svc prometheus -p '{\"spec\":{\"externalIPs\":[\"192.168.49.2\"]}}'",
      "kubectl patch svc node-exporter -p '{\"spec\":{\"externalIPs\":[\"192.168.49.2\"]}}'",
      "kubectl apply -f https://github.com/kubernetes-sigs/metrics-server/releases/latest/download/components.yaml"
    ]    
  }
  depends_on = [null_resource.miniqube_run]
}

output "internal_ip_address_vm_1" {
  value = yandex_compute_instance.vm-1.network_interface.0.ip_address
}

output "external_ip_address_vm_1" {
  value = yandex_compute_instance.vm-1.network_interface.0.nat_ip_address
}